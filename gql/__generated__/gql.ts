/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query SingleBoardDocument($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n": typeof types.SingleBoardDocumentDocument,
    "\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        name\n        type\n        config\n        position\n      }\n    }\n  }\n": typeof types.ListFieldsCollectionFragmentDoc,
    "\n  fragment Card on cardsEdge {\n    node {\n      id\n      title\n      position\n      color\n      listsCollection(orderBy: [{ position: AscNullsLast }]) {\n        ...ListsCollection\n      }\n    }\n  }\n": typeof types.CardFragmentDoc,
    "\n  fragment CardsCollection on cardsConnection {\n    edges {\n      node {\n        id\n      }\n      ...Card\n    }\n  }\n": typeof types.CardsCollectionFragmentDoc,
    "\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        ...ListValuesCollection\n      }\n    }\n  }\n": typeof types.ListFragmentDoc,
    "\n  fragment ListValuesCollection on list_valuesConnection {\n    edges {\n      node {\n        id\n        value\n        list_fields {\n          type\n          config\n          position\n        }\n      }\n    }\n  }\n": typeof types.ListValuesCollectionFragmentDoc,
    "\n  fragment ListsCollection on listsConnection {\n    edges {\n      node {\n        id\n      }\n      ...List\n    }\n  }\n": typeof types.ListsCollectionFragmentDoc,
    "\n  fragment Board on boardsEdge {\n    node {\n      id\n      title\n    }\n  }\n": typeof types.BoardFragmentDoc,
    "\n  query AllBoardDocument($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n": typeof types.AllBoardDocumentDocument,
    "\n  query BoardListFieldsDocument($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n": typeof types.BoardListFieldsDocumentDocument,
    "\n  query ListWithValuesDocument($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...createdList\n        }\n      }\n    }\n  }\n": typeof types.ListWithValuesDocumentDocument,
    "\n  fragment createdList on lists {\n    id\n    position\n    list_valuesCollection {\n      ...ListValuesCollection @unmask\n    }\n  }\n": typeof types.CreatedListFragmentDoc,
};
const documents: Documents = {
    "\n  query SingleBoardDocument($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n": types.SingleBoardDocumentDocument,
    "\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        name\n        type\n        config\n        position\n      }\n    }\n  }\n": types.ListFieldsCollectionFragmentDoc,
    "\n  fragment Card on cardsEdge {\n    node {\n      id\n      title\n      position\n      color\n      listsCollection(orderBy: [{ position: AscNullsLast }]) {\n        ...ListsCollection\n      }\n    }\n  }\n": types.CardFragmentDoc,
    "\n  fragment CardsCollection on cardsConnection {\n    edges {\n      node {\n        id\n      }\n      ...Card\n    }\n  }\n": types.CardsCollectionFragmentDoc,
    "\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        ...ListValuesCollection\n      }\n    }\n  }\n": types.ListFragmentDoc,
    "\n  fragment ListValuesCollection on list_valuesConnection {\n    edges {\n      node {\n        id\n        value\n        list_fields {\n          type\n          config\n          position\n        }\n      }\n    }\n  }\n": types.ListValuesCollectionFragmentDoc,
    "\n  fragment ListsCollection on listsConnection {\n    edges {\n      node {\n        id\n      }\n      ...List\n    }\n  }\n": types.ListsCollectionFragmentDoc,
    "\n  fragment Board on boardsEdge {\n    node {\n      id\n      title\n    }\n  }\n": types.BoardFragmentDoc,
    "\n  query AllBoardDocument($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n": types.AllBoardDocumentDocument,
    "\n  query BoardListFieldsDocument($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n": types.BoardListFieldsDocumentDocument,
    "\n  query ListWithValuesDocument($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...createdList\n        }\n      }\n    }\n  }\n": types.ListWithValuesDocumentDocument,
    "\n  fragment createdList on lists {\n    id\n    position\n    list_valuesCollection {\n      ...ListValuesCollection @unmask\n    }\n  }\n": types.CreatedListFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SingleBoardDocument($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n"): (typeof documents)["\n  query SingleBoardDocument($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        name\n        type\n        config\n        position\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        name\n        type\n        config\n        position\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Card on cardsEdge {\n    node {\n      id\n      title\n      position\n      color\n      listsCollection(orderBy: [{ position: AscNullsLast }]) {\n        ...ListsCollection\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment Card on cardsEdge {\n    node {\n      id\n      title\n      position\n      color\n      listsCollection(orderBy: [{ position: AscNullsLast }]) {\n        ...ListsCollection\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CardsCollection on cardsConnection {\n    edges {\n      node {\n        id\n      }\n      ...Card\n    }\n  }\n"): (typeof documents)["\n  fragment CardsCollection on cardsConnection {\n    edges {\n      node {\n        id\n      }\n      ...Card\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        ...ListValuesCollection\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        ...ListValuesCollection\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListValuesCollection on list_valuesConnection {\n    edges {\n      node {\n        id\n        value\n        list_fields {\n          type\n          config\n          position\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ListValuesCollection on list_valuesConnection {\n    edges {\n      node {\n        id\n        value\n        list_fields {\n          type\n          config\n          position\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListsCollection on listsConnection {\n    edges {\n      node {\n        id\n      }\n      ...List\n    }\n  }\n"): (typeof documents)["\n  fragment ListsCollection on listsConnection {\n    edges {\n      node {\n        id\n      }\n      ...List\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Board on boardsEdge {\n    node {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  fragment Board on boardsEdge {\n    node {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllBoardDocument($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllBoardDocument($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BoardListFieldsDocument($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query BoardListFieldsDocument($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListWithValuesDocument($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...createdList\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListWithValuesDocument($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...createdList\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment createdList on lists {\n    id\n    position\n    list_valuesCollection {\n      ...ListValuesCollection @unmask\n    }\n  }\n"): (typeof documents)["\n  fragment createdList on lists {\n    id\n    position\n    list_valuesCollection {\n      ...ListValuesCollection @unmask\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;