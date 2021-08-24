## Functions

<dl>
<dt><a href="#apiRequest">apiRequest(body, [method], token, url)</a> ⇒ <code><a href="#ApiGatewayResponse">ApiGatewayResponse</a></code></dt>
<dd><p>Make a request agains the Github API</p>
</dd>
<dt><a href="#repositoryDispatchHandler">repositoryDispatchHandler(event)</a> ⇒ <code><a href="#ApiGatewayResponse">Promise.&lt;ApiGatewayResponse&gt;</a></code></dt>
<dd><p>RepositoryDispatch handler
Proxy a <a href="https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event">repository_dispatch event</a> request</p>
</dd>
<dt><a href="#workflowDispatchHandler">workflowDispatchHandler(event)</a> ⇒ <code><a href="#ApiGatewayResponse">Promise.&lt;ApiGatewayResponse&gt;</a></code></dt>
<dd><p>WorkflowDispatch handler
Proxy a <a href="https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event">workflow_dispatch event</a>
request for the specified <code>ref</code>.</p>
<p>If the <code>ref</code> is <code>refs/tags</code> then the event will be triggered for the last tag.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ApiGatewayResponse">ApiGatewayResponse</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#GithubTag">GithubTag</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ApiGatewayEventRepositoryDispatch">ApiGatewayEventRepositoryDispatch</a> : <code>Object</code></dt>
<dd><p>See: <a href="https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event--parameters">https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event--parameters</a></p>
</dd>
<dt><a href="#ApiGatewayEventWorkflowDispatch">ApiGatewayEventWorkflowDispatch</a> : <code>Object</code></dt>
<dd><p>See: <a href="https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event--parameters">https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event--parameters</a></p>
</dd>
</dl>

<a name="apiRequest"></a>

## apiRequest(body, [method], token, url) ⇒ [<code>ApiGatewayResponse</code>](#ApiGatewayResponse)
Make a request agains the Github API

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| body | <code>Object</code> |  |  |
| [method] | <code>string</code> | <code>&quot;POST&quot;</code> |  |
| token | <code>string</code> |  | Github Authorization token |
| url | <code>string</code> |  |  |

<a name="repositoryDispatchHandler"></a>

## repositoryDispatchHandler(event) ⇒ [<code>Promise.&lt;ApiGatewayResponse&gt;</code>](#ApiGatewayResponse)
RepositoryDispatch handler
Proxy a [repository_dispatch event](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event) request

**Kind**: global function  
**Returns**: [<code>Promise.&lt;ApiGatewayResponse&gt;</code>](#ApiGatewayResponse) - - Resolves to API Gateway formatted response  
**Throws**:

- <code>Error</code> - Error hitting the Github API, proxied from {apiRequest}


| Param | Type | Description |
| --- | --- | --- |
| event | [<code>ApiGatewayEventRepositoryDispatch</code>](#ApiGatewayEventRepositoryDispatch) | The API Gateway event |

<a name="workflowDispatchHandler"></a>

## workflowDispatchHandler(event) ⇒ [<code>Promise.&lt;ApiGatewayResponse&gt;</code>](#ApiGatewayResponse)
WorkflowDispatch handler
Proxy a [workflow_dispatch event](https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event)
request for the specified `ref`.

If the `ref` is `refs/tags` then the event will be triggered for the last tag.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;ApiGatewayResponse&gt;</code>](#ApiGatewayResponse) - - Resolves to API Gateway formatted response  
**Throws**:

- <code>Error</code> - Error hitting the Github API, proxied from {apiRequest}


| Param | Type | Description |
| --- | --- | --- |
| event | [<code>ApiGatewayEventWorkflowDispatch</code>](#ApiGatewayEventWorkflowDispatch) | The API Gateway event |

<a name="ApiGatewayResponse"></a>

## ApiGatewayResponse : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| isBase64Encoded | <code>boolean</code> | 
| statusCode | <code>number</code> | 
| headers | <code>Object</code> | 
| headers['Content-Type' | <code>string</code> | 
| body | <code>string</code> | 

<a name="GithubTag"></a>

## GithubTag : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| ref | <code>string</code> | 

<a name="ApiGatewayEventRepositoryDispatch"></a>

## ApiGatewayEventRepositoryDispatch : <code>Object</code>
See: https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event--parameters

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| body | <code>string</code> |  |
| headers | <code>Object</code> |  |
| headers.Authorization | <code>string</code> | Github Authorization token |
| pathParameters | <code>Object</code> |  |
| pathParameters.owner | <code>string</code> | Github repository owner |
| pathParameters.repo | <code>string</code> | Github repository name |
| queryStringParameters | <code>Object</code> |  |
| queryStringParameters.eventType | <code>string</code> | A custom webhook event name |

<a name="ApiGatewayEventWorkflowDispatch"></a>

## ApiGatewayEventWorkflowDispatch : <code>Object</code>
See: https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event--parameters

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| body | <code>string</code> |  |
| headers | <code>Object</code> |  |
| headers.Authorization | <code>string</code> | Github Authorization token |
| pathParameters | <code>Object</code> |  |
| pathParameters.owner | <code>string</code> | Github repository owner |
| pathParameters.repo | <code>string</code> | Github repository name |
| pathParameters.workflowId | <code>string</code> | The ID of the workflow |
| queryStringParameters | <code>Object</code> |  |
| queryStringParameters.ref | <code>string</code> | The git reference for the workflow |

