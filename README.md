# RootKit

Manage Sources and ZK with GunDB

## User Stories

* Post an isolated ZK
* Reply to an existing ZK

## Data Model

source
- uuid: string
- title: string
- ref: string
--
* categories: Set

zk
- uuid: string
- content
--
* parent: Link
* children: Set
