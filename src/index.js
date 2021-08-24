import nodeFetch from 'node-fetch'

const apiRoot = 'https://api.github.com'

/**
 * @typedef {Object} ApiGatewayResponse
 * @property {boolean} isBase64Encoded
 * @property {number} statusCode
 * @property {Object} headers
 * @property {string} headers['Content-Type']
 * @property {string} body
 */

/**
 * Return an object compatible with API Gateway
 *
 * @private
 * @param {Object} [body={}] - body to be returned, will be stringified
 * @param {number} [statusCode=200]
 * @returns {ApiGatewayResponse}
 */
function apiGatewayResponse ({ body = {}, statusCode = 200 }) {
  return {
    isBase64Encoded: false,
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

/**
 * Make a request agains the Github API
 *
 * @async
 * @param {Object} body
 * @param {string} [method=POST]
 * @param {string} token - Github Authorization token
 * @param {string} url
 * @returns {ApiGatewayResponse}
 */
async function apiRequest ({ body, method = 'POST', token, url }) {
  console.log('apiRequest', { body, method, url })
  const options = {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: token }
  }

  let response
  try {
    response = await nodeFetch(url, options)
  } catch (error) {
    console.error('apiRequest: Error', error)
    const { statusCode = 500 } = error
    return apiGatewayResponse({ body: error, statusCode })
  }

  const { status } = response
  console.log('apiRequest: Success', status)

  let statusCode = status
  if (status === 204) {
    statusCode = 200
  }

  return apiGatewayResponse({ statusCode })
}

/**
 * @typedef {Object} GithubTag
 * @property {string} ref
 */

/**
 * Fetch all the tags for a repository and return the latest one
 *
 * @private
 * @async
 * @param {string} owner - Github repository owner
 * @param {string} repo - Github repository name
 * @param {string} token - Github Authorization token
 * @returns {Promise<GithubTag>} - Resolves to the latest Github Tag
 */
async function fetchLastTag ({ owner, repo, token }) {
  console.log('fetchLastTag', { owner, repo })
  const url = `${apiRoot}/repos/${owner}/${repo}/git/refs/tags`
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token }
  }

  let tags
  try {
    const response = await nodeFetch(url, options)
    tags = await response.json()
  } catch (error) {
    console.error('fetchLastTag: Error', error)
    const { statusCode = 500 } = error
    return apiGatewayResponse({ body: error, statusCode })
  }

  const lastTag = tags.pop()
  return lastTag
}

/**
 * See: https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event--parameters
 *
 * @typedef {Object} ApiGatewayEventRepositoryDispatch
 * @property {string} body
 * @property {Object} headers
 * @property {string} headers.Authorization - Github Authorization token
 * @property {Object} pathParameters
 * @property {string} pathParameters.owner - Github repository owner
 * @property {string} pathParameters.repo - Github repository name
 * @property {Object} queryStringParameters
 * @property {string} queryStringParameters.eventType - A custom webhook event name
 */

/**
 * RepositoryDispatch handler
 * Proxy a [repository_dispatch event](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event) request
 *
 * @param {ApiGatewayEventRepositoryDispatch} event - The API Gateway event
 * @throws {Error} - Error hitting the Github API, proxied from {apiRequest}
 * @returns {Promise<ApiGatewayResponse>} - Resolves to API Gateway formatted response
 */
export function repositoryDispatchHandler (event) {
  console.log('repositoryDispatchHandler Request received')
  const {
    body: rawBody,
    headers: { Authorization: token },
    pathParameters: { owner, repo },
    queryStringParameters: { eventType }
  } = event

  console.log('repositoryDispatchHandler', { body: rawBody, owner, repo, eventType })

  const url = `${apiRoot}/repos/${owner}/${repo}/dispatches`
  const clientPayload = JSON.parse(rawBody)
  console.log('repositoryDispatchHandler, discarding supplied clientPayload', clientPayload)

  const body = { client_payload: {}, event_type: eventType }

  return apiRequest({ body, token, url })
}

/**
 * See: https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event--parameters
 *
 * @typedef {Object} ApiGatewayEventWorkflowDispatch
 * @property {string} body
 * @property {Object} headers
 * @property {string} headers.Authorization - Github Authorization token
 * @property {Object} pathParameters
 * @property {string} pathParameters.owner - Github repository owner
 * @property {string} pathParameters.repo - Github repository name
 * @property {string} pathParameters.workflowId - The ID of the workflow
 * @property {Object} queryStringParameters
 * @property {string} queryStringParameters.ref - The git reference for the workflow
 */

/**
 * WorkflowDispatch handler
 * Proxy a [workflow_dispatch event](https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event)
 * request for the specified `ref`.
 *
 * If the `ref` is `refs/tags` then the event will be triggered for the last tag.
 *
 * @async
 * @param {ApiGatewayEventWorkflowDispatch} event - The API Gateway event
 * @throws {Error} - Error hitting the Github API, proxied from {apiRequest}
 * @returns {Promise<ApiGatewayResponse>} - Resolves to API Gateway formatted response
 */
export async function workflowDispatchHandler (event) {
  console.log('workflowDispatchHandler Request received')
  const {
    body: rawBody,
    headers: { Authorization: token },
    pathParameters: { owner, repo, workflowId },
    queryStringParameters: { ref }
  } = event

  console.log('workflowDispatchHandler', { body: rawBody, owner, ref, repo, workflowId })

  let finalRef = ref
  if (ref === 'refs/tags') {
    const tag = await fetchLastTag({ owner, repo, token })
    finalRef = tag.ref
  }

  const url = `${apiRoot}/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`
  const inputs = JSON.parse(rawBody)
  console.log('workflowDispatchHandler, discarding supplied inputs', inputs)

  const body = { inputs: {}, ref: finalRef }

  return apiRequest({ body, token, url })
}
