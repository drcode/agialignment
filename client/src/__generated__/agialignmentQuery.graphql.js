/**
 * @generated SignedSource<<9008c3cea42de388cf134f1a93ad1c09>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "App",
    "kind": "LinkedField",
    "name": "app",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "agialignmentQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "agialignmentQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ebacee9fb966ccee3f0ab26bfcf6110d",
    "id": null,
    "metadata": {},
    "name": "agialignmentQuery",
    "operationKind": "query",
    "text": "query agialignmentQuery {\n  app {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b085233a4309b3835494209648da8b24";

module.exports = node;
