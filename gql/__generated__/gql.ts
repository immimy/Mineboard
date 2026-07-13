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
    "\n  query SingleBoard($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n": typeof types.SingleBoardDocument,
    "\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        type\n        config\n        position\n      }\n    }\n  }\n": typeof types.ListFieldsCollectionFragmentDoc,
    "\n  fragment Card on cardsEdge {\n    node {\n      id\n      title\n      position\n      color\n      listsCollection(orderBy: [{ position: AscNullsLast }]) {\n        ...ListsCollection\n      }\n    }\n  }\n": typeof types.CardFragmentDoc,
    "\n  fragment CardsCollection on cardsConnection {\n    edges {\n      node {\n        id\n      }\n      ...Card\n    }\n  }\n": typeof types.CardsCollectionFragmentDoc,
    "\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        edges {\n          node {\n            ...ListValues\n          }\n        }\n      }\n    }\n  }\n": typeof types.ListFragmentDoc,
    "\n  fragment ListValues on list_values {\n    id\n    value\n    list_fields {\n      id\n      type\n      config\n      position\n    }\n  }\n": typeof types.ListValuesFragmentDoc,
    "\n  fragment ListsCollection on listsConnection {\n    edges {\n      node {\n        id\n      }\n      ...List\n    }\n  }\n": typeof types.ListsCollectionFragmentDoc,
    "\n  fragment Board on boardsEdge {\n    node {\n      id\n      title\n    }\n  }\n": typeof types.BoardFragmentDoc,
    "\n  query AllBoards($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n": typeof types.AllBoardsDocument,
    "\n  fragment UpdateBoardTitleTestBoard on boards {\n    id\n    title\n  }\n": typeof types.UpdateBoardTitleTestBoardFragmentDoc,
    "\n  query BoardTitle($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n": typeof types.BoardTitleDocument,
    "\n  query BoardListFields($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n": typeof types.BoardListFieldsDocument,
    "\n  query ListValues($listId: UUID!) {\n    list_valuesCollection(filter: { list_id: { eq: $listId } }) {\n      edges {\n        node {\n          id\n          list_field_id\n          value\n        }\n      }\n    }\n  }\n": typeof types.ListValuesDocument,
    "\n  query CachedList($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...MutatedList\n        }\n      }\n    }\n  }\n": typeof types.CachedListDocument,
    "\n  query CachedBoardLists($boardId: UUID!) {\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      edges {\n        node {\n          id\n          listsCollection(orderBy: [{ position: AscNullsLast }]) {\n            ...ListsCollection @unmask\n          }\n        }\n      }\n    }\n  }\n": typeof types.CachedBoardListsDocument,
    "\n  fragment MutatedList on lists {\n    id\n    position\n    list_valuesCollection {\n      edges {\n        node {\n          ...ListValues @unmask\n        }\n      }\n    }\n  }\n": typeof types.MutatedListFragmentDoc,
    "\n  query CachedCard($cardId: UUID!) {\n    cardsCollection(filter: { id: { eq: $cardId } }) {\n      edges {\n        ...Card @unmask\n      }\n    }\n  }\n": typeof types.CachedCardDocument,
    "\n  mutation UpdateCard(\n    $cardId: UUID!\n    $title: String!\n    $color: Opaque!\n    $updatedAt: Datetime!\n  ) {\n    updatecardsCollection(\n      filter: { id: { eq: $cardId } }\n      set: { title: $title, color: $color, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n        color\n      }\n    }\n  }\n": typeof types.UpdateCardDocument,
    "\n  query CachedBoard($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n": typeof types.CachedBoardDocument,
    "\n  mutation UpdateBoardTitle(\n    $boardId: UUID!\n    $title: String!\n    $updatedAt: Datetime!\n  ) {\n    updateboardsCollection(\n      filter: { id: { eq: $boardId } }\n      set: { title: $title, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n      }\n    }\n  }\n": typeof types.UpdateBoardTitleDocument,
    "\n  query CachedListFields($boardId: UUID!) {\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection @unmask\n    }\n  }\n": typeof types.CachedListFieldsDocument,
};
const documents: Documents = {
    "\n  query SingleBoard($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n": types.SingleBoardDocument,
    "\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        type\n        config\n        position\n      }\n    }\n  }\n": types.ListFieldsCollectionFragmentDoc,
    "\n  fragment Card on cardsEdge {\n    node {\n      id\n      title\n      position\n      color\n      listsCollection(orderBy: [{ position: AscNullsLast }]) {\n        ...ListsCollection\n      }\n    }\n  }\n": types.CardFragmentDoc,
    "\n  fragment CardsCollection on cardsConnection {\n    edges {\n      node {\n        id\n      }\n      ...Card\n    }\n  }\n": types.CardsCollectionFragmentDoc,
    "\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        edges {\n          node {\n            ...ListValues\n          }\n        }\n      }\n    }\n  }\n": types.ListFragmentDoc,
    "\n  fragment ListValues on list_values {\n    id\n    value\n    list_fields {\n      id\n      type\n      config\n      position\n    }\n  }\n": types.ListValuesFragmentDoc,
    "\n  fragment ListsCollection on listsConnection {\n    edges {\n      node {\n        id\n      }\n      ...List\n    }\n  }\n": types.ListsCollectionFragmentDoc,
    "\n  fragment Board on boardsEdge {\n    node {\n      id\n      title\n    }\n  }\n": types.BoardFragmentDoc,
    "\n  query AllBoards($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n": types.AllBoardsDocument,
    "\n  fragment UpdateBoardTitleTestBoard on boards {\n    id\n    title\n  }\n": types.UpdateBoardTitleTestBoardFragmentDoc,
    "\n  query BoardTitle($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n": types.BoardTitleDocument,
    "\n  query BoardListFields($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n": types.BoardListFieldsDocument,
    "\n  query ListValues($listId: UUID!) {\n    list_valuesCollection(filter: { list_id: { eq: $listId } }) {\n      edges {\n        node {\n          id\n          list_field_id\n          value\n        }\n      }\n    }\n  }\n": types.ListValuesDocument,
    "\n  query CachedList($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...MutatedList\n        }\n      }\n    }\n  }\n": types.CachedListDocument,
    "\n  query CachedBoardLists($boardId: UUID!) {\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      edges {\n        node {\n          id\n          listsCollection(orderBy: [{ position: AscNullsLast }]) {\n            ...ListsCollection @unmask\n          }\n        }\n      }\n    }\n  }\n": types.CachedBoardListsDocument,
    "\n  fragment MutatedList on lists {\n    id\n    position\n    list_valuesCollection {\n      edges {\n        node {\n          ...ListValues @unmask\n        }\n      }\n    }\n  }\n": types.MutatedListFragmentDoc,
    "\n  query CachedCard($cardId: UUID!) {\n    cardsCollection(filter: { id: { eq: $cardId } }) {\n      edges {\n        ...Card @unmask\n      }\n    }\n  }\n": types.CachedCardDocument,
    "\n  mutation UpdateCard(\n    $cardId: UUID!\n    $title: String!\n    $color: Opaque!\n    $updatedAt: Datetime!\n  ) {\n    updatecardsCollection(\n      filter: { id: { eq: $cardId } }\n      set: { title: $title, color: $color, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n        color\n      }\n    }\n  }\n": types.UpdateCardDocument,
    "\n  query CachedBoard($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n": types.CachedBoardDocument,
    "\n  mutation UpdateBoardTitle(\n    $boardId: UUID!\n    $title: String!\n    $updatedAt: Datetime!\n  ) {\n    updateboardsCollection(\n      filter: { id: { eq: $boardId } }\n      set: { title: $title, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n      }\n    }\n  }\n": types.UpdateBoardTitleDocument,
    "\n  query CachedListFields($boardId: UUID!) {\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection @unmask\n    }\n  }\n": types.CachedListFieldsDocument,
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
export function graphql(source: "\n  query SingleBoard($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n"): (typeof documents)["\n  query SingleBoard($boardId: UUID!) {\n    # Board\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board\n      }\n    }\n    # List Fields\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection\n    }\n    # Cards\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...CardsCollection\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        type\n        config\n        position\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ListFieldsCollection on list_fieldsConnection {\n    edges {\n      node {\n        id\n        type\n        config\n        position\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        edges {\n          node {\n            ...ListValues\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment List on listsEdge {\n    node {\n      id\n      position\n      list_valuesCollection {\n        edges {\n          node {\n            ...ListValues\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListValues on list_values {\n    id\n    value\n    list_fields {\n      id\n      type\n      config\n      position\n    }\n  }\n"): (typeof documents)["\n  fragment ListValues on list_values {\n    id\n    value\n    list_fields {\n      id\n      type\n      config\n      position\n    }\n  }\n"];
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
export function graphql(source: "\n  query AllBoards($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllBoards($userId: UUID!) {\n    boardsCollection(\n      filter: { user_id: { eq: $userId } }\n      orderBy: { created_at: DescNullsLast }\n    ) {\n      edges {\n        node {\n          id\n        }\n        ...Board\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UpdateBoardTitleTestBoard on boards {\n    id\n    title\n  }\n"): (typeof documents)["\n  fragment UpdateBoardTitleTestBoard on boards {\n    id\n    title\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BoardTitle($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n"): (typeof documents)["\n  query BoardTitle($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BoardListFields($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query BoardListFields($boardId: UUID!) {\n    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {\n      edges {\n        node {\n          id\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListValues($listId: UUID!) {\n    list_valuesCollection(filter: { list_id: { eq: $listId } }) {\n      edges {\n        node {\n          id\n          list_field_id\n          value\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListValues($listId: UUID!) {\n    list_valuesCollection(filter: { list_id: { eq: $listId } }) {\n      edges {\n        node {\n          id\n          list_field_id\n          value\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CachedList($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...MutatedList\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CachedList($listId: UUID!) {\n    listsCollection(filter: { id: { eq: $listId } }) {\n      edges {\n        node {\n          ...MutatedList\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CachedBoardLists($boardId: UUID!) {\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      edges {\n        node {\n          id\n          listsCollection(orderBy: [{ position: AscNullsLast }]) {\n            ...ListsCollection @unmask\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CachedBoardLists($boardId: UUID!) {\n    cardsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      edges {\n        node {\n          id\n          listsCollection(orderBy: [{ position: AscNullsLast }]) {\n            ...ListsCollection @unmask\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MutatedList on lists {\n    id\n    position\n    list_valuesCollection {\n      edges {\n        node {\n          ...ListValues @unmask\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MutatedList on lists {\n    id\n    position\n    list_valuesCollection {\n      edges {\n        node {\n          ...ListValues @unmask\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CachedCard($cardId: UUID!) {\n    cardsCollection(filter: { id: { eq: $cardId } }) {\n      edges {\n        ...Card @unmask\n      }\n    }\n  }\n"): (typeof documents)["\n  query CachedCard($cardId: UUID!) {\n    cardsCollection(filter: { id: { eq: $cardId } }) {\n      edges {\n        ...Card @unmask\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCard(\n    $cardId: UUID!\n    $title: String!\n    $color: Opaque!\n    $updatedAt: Datetime!\n  ) {\n    updatecardsCollection(\n      filter: { id: { eq: $cardId } }\n      set: { title: $title, color: $color, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCard(\n    $cardId: UUID!\n    $title: String!\n    $color: Opaque!\n    $updatedAt: Datetime!\n  ) {\n    updatecardsCollection(\n      filter: { id: { eq: $cardId } }\n      set: { title: $title, color: $color, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CachedBoard($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n"): (typeof documents)["\n  query CachedBoard($boardId: UUID!) {\n    boardsCollection(filter: { id: { eq: $boardId } }) {\n      edges {\n        ...Board @unmask\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBoardTitle(\n    $boardId: UUID!\n    $title: String!\n    $updatedAt: Datetime!\n  ) {\n    updateboardsCollection(\n      filter: { id: { eq: $boardId } }\n      set: { title: $title, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateBoardTitle(\n    $boardId: UUID!\n    $title: String!\n    $updatedAt: Datetime!\n  ) {\n    updateboardsCollection(\n      filter: { id: { eq: $boardId } }\n      set: { title: $title, updated_at: $updatedAt }\n      atMost: 1\n    ) {\n      records {\n        id\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CachedListFields($boardId: UUID!) {\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection @unmask\n    }\n  }\n"): (typeof documents)["\n  query CachedListFields($boardId: UUID!) {\n    list_fieldsCollection(\n      filter: { board_id: { eq: $boardId } }\n      orderBy: [{ position: AscNullsLast }]\n    ) {\n      ...ListFieldsCollection @unmask\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;