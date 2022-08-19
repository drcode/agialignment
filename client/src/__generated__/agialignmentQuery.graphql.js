/**
 * @generated SignedSource<<f2484197bc9111aed241dd52a679901e>>
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
            "name": "aiResearcher",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "aiRisk",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "expert",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "followers",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "message",
            "storageKey": null
          },
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
    "cacheID": "dc05ec3a0e6fe9a2ec59b74ecdb7af29",
    "id": null,
    "metadata": {},
    "name": "agialignmentQuery",
    "operationKind": "query",
    "text": "query agialignmentQuery(\n  $oauthToken: String\n  $oauthVerifier: String\n) {\n  app(oauthToken: $oauthToken, oauthVerifier: $oauthVerifier) {\n    id\n    userid\n    avatars {\n      id\n      userid\n      aiResearcher\n      aiRisk\n      expert\n      followers\n      message\n      x\n      y\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b6e37200bf786153b3dff054a9231bbd";

module.exports = node;
