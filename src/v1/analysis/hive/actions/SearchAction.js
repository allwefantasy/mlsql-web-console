import React, { useState, useRef, useEffect, useCallback } from 'react';
import ActionMaker from "../../../ActionMaker"
import Tools from '../../../../common/Tools';

const loop = (data, searchValue) =>
    data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
            index > -1 ? (
                <span>
                    {beforeStr}
                    <span className="site-tree-search-value">{searchValue}</span>
                    {afterStr}
                </span>
            ) : (
                    <span>{item.title}</span>
                );

        if (item.children) {
            return { ...item, title, children: loop(item.children, searchValue) }
        }

        return { ...item, title }
    });

export const { handler: SearchActionHandler, action: SearchAction } = ActionMaker.buildHandler(async (action) => {
    const { dbs } = action.__state
    const { searchValue } = action.data
    if (!searchValue) {
        return {
            data: {
                expandedKeys: [], search_dbs: dbs
            }
        }
    }

    let showKeys = []
    let expandedKeys = dbs
        .flatMap(item => {            
            const wow = item.children?.map(sub => {
                if (sub.title.indexOf(searchValue) > -1) {
                    return item.key
                }
                return null
            }).filter(item => item) || []

            if(item.title.indexOf(searchValue) > -1){                  
                showKeys.push(item.key)
            }
            return wow
        })
   
    expandedKeys = Tools.distinct(expandedKeys)    
    const search_dbs = loop(dbs, searchValue).filter(item => {
        return expandedKeys.includes(item.key) || showKeys.includes(item.key)
    })
    return {
        data: {
            expandedKeys, search_dbs
        }
    }
})