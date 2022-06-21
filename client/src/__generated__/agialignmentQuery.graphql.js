/**
 * @generated SignedSource<<62a89bf44b0ec664a3f8d0f263e2458b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "oauthToken"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "oauthVerifier"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "userid",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "oauthToken",
        "variableName": "oauthToken"
      },
      {
        "kind": "Variable",
        "name": "oauthVerifier",
        "variableName": "oauthVerifier"
      }
    ],
    "concreteType": "App",
    "kind": "LinkedField",
    "name": "app",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Avatar",
        "kind": "LinkedField",
        "name": "avatars",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "agialignmentQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "agialignmentQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "0efdc82de75247fd9c931863b7486159",
    "id": null,
    "metadata": {},
    "name": "agialignmentQuery",
    "operationKind": "query",
    "text": "query agialignmentQuery(\n  $oauthToken: String\n  $oauthVerifier: String\n) {\n  app(oauthToken: $oauthToken, oauthVerifier: $oauthVerifier) {\n    id\n    userid\n    avatars {\n      id\n      userid\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9f74b274764c143a041d59b967ab9868";

module.exports = node;
