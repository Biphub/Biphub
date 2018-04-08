import * as R from 'ramda'
import styled from 'styled-components'
import vis from 'vis'
import React, { Component } from 'react'
import Modal from './Modal'

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const Vis = styled.div`
  width: 100%;
  height: 100%;
`

class Pipeline extends Component {
  componentWillUpdate(nextProps) {
    const { nodes, edges } = nextProps
    const newNodes = R.map(
      x => ({
        id: x.id,
        label: x.actionName,
        icon: x.icon,
      }),
      nodes,
    )
    if (newNodes && edges) {
      this._renderGraph(newNodes, edges)
    }
  }
  _clickGraphComponent = () => {
    console.log('clicked graph component')
  }
  _renderGraph = (nodes, edges) => {
    /**
     * [
     {id: 1, label: 'Node 1'},
     {id: 2, label: 'Node 2'},
     {id: 3, label: 'Node 3'},
     {id: 4, label: 'Node 4'},
     {id: 5, label: 'Node 5'}
     ]
     * @type {vis.DataSet}
     */
    const nz = new vis.DataSet(nodes)
    nz.on('click', props => {})
    // create an array with edges
    /**
     * [
     {from: 1, to: 3},
     {from: 1, to: 2},
     {from: 2, to: 4},
     {from: 2, to: 5}
     ]
     * @type {vis.DataSet}
     */
    const ez = new vis.DataSet([
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 1, to: 6 },
      { from: 2, to: 3 },
      { from: 4, to: 5 },
    ])

    // create a network
    const container = document.getElementById('VisContainer')

    // provide the data in the vis format
    const data = {
      nodes: nz,
      edges: ez,
    }
    const options = {}
    // initialize your network!
    const network = new vis.Network(container, data, options)
    network.on('click', props => {
      console.log('on network click! ', props)
    })
  }
  render() {
    return (
      <Container>
        <Vis id="VisContainer" />
        <div>test</div>
      </Container>
    )
  }
}

export default Pipeline
