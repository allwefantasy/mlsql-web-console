import * as React from 'react'

export interface Column {
    name: string
    type: string
    nullable: string
    metadata: Object
}

export interface Schema {    
    type: string
    fields: Array<Column>
}
