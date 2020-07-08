import * as React from "react";
import { Tree ,Spin,Menu,Icon} from 'antd';
import DeltaLakeTree from "../detla_lake/DeltaLakeTree";
const { TreeNode, DirectoryTree } = Tree;
export default class ADeltaLakeTree extends DeltaLakeTree{
    constructor(props){
        super(props)        
    }
    tableClick=(evt)=>{                
        this.setState({
            rightClickNodeTreeItem: {
                pageX: evt.event.pageX,
                pageY: evt.event.pageY,
                table: evt.node.props['table'],
                db: evt.node.props['db']
            }
        })       
    }
    show(){          
        return Object.entries(this.state.dbs).map(([key,value])=>{                   
            return <TreeNode  title={key} key={key}>
               {value.map(item=>{                   
                   return <TreeNode title={item} table={item} db={key} key={item} isLeaf />
               })} 
            </TreeNode>
        })
    }

    contextMenu(){        
        if(!this.state.rightClickNodeTreeItem){
            return <div></div>
        }        
        const {pageX, pageY} = {...this.state.rightClickNodeTreeItem};
        const tmpStyle = {
            position: 'absolute',
            left: `${pageX}px`,
            top: `${pageY}px`
        };
        return <div style={tmpStyle}> <Menu>
        <Menu.Item key='1'><Icon type='plus-circle'/>{'加同级'}</Menu.Item>
        <Menu.Item key='2'><Icon type='plus-circle-o'/>{'加下级'}</Menu.Item>
        <Menu.Item key='4'><Icon type='edit'/>{'修改'}</Menu.Item>
        <Menu.Item key='3'><Icon type='minus-circle-o'/>{'删除目录'}</Menu.Item>
     </Menu> </div>
    }
    render(){
        
        return (
            
          <div>
              {this.contextMenu()}
              <Spin tip="Loading..." spinning={this.state.loading}>
                    <DirectoryTree  onRightClick={this.tableClick} >
                       {this.show()}
                    </DirectoryTree>
              </Spin>            
          </div>
          
          
        )
      }
}