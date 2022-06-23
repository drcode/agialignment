/**
 * @generated SignedSource<<455ddb68370e549f4ac2773af94fac70>>
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "x",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "y",
            "storageKey": null
          }
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
    "cacheID": "fe252ecd92fb8184e53d4d146ebddd5c",
    "id": null,
    "metadata": {},
    "name": "agialignmentQuery",
    "operationKind": "query",
    "text": "query agialignmentQuery(\n  $oauthToken: String\n  $oauthVerifier: String\n) {\n  app(oauthToken: $oauthToken, oauthVerifier: $oauthVerifier) {\n    id\n    userid\n    avatars {\n      id\n      userid\n      x\n      y\n    }\n  }\n}\n"
  }
};
})();

node.hash = "159b5987b86b72cccdbf0c9f181b1970";

module.exports = node;
