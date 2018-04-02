import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import Chip from 'material-ui/Chip'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'

const Container = styled.div`
  min-width: 200px;
  height: 100%;
`

const Toolbox = styled.div`
  min-height: 60px;
`

const EdgeContainer = styled.div`
  width: 100%;
`

const PodContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 200px;
  justify-content: space-between;
`

const Pod = styled.div`
  cursor: pointer;
  text-align: center;
  width: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .sidebar-icon-container {
    height: 50px;
    width: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .sidebar-icon-container img {
    width: 45px;
  }
`

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
})

class PipelineSidebar extends Component {
  _onClickCreateEdge = () => {
  }
  _onClickPod = pod => {
  }
  render() {
    const { classes, host = '', pods = [] } = this.props
    const PodList = R.map(
      x => (
        <Pod onClick={() => this._onClickPod(x)}>
          <div className="sidebar-icon-container">
            <img src={`${host}${x.icon}`} />
          </div>
          <div>Pod!</div>
        </Pod>
      ),
      pods,
    )
    return (
      <Container>
        <Toolbox />
        <Divider />
        <EdgeContainer>
          <Chip
            avatar={<Avatar>MB</Avatar>}
            label="Create Edge"
            onClick={this._onClickCreateEdge}
            className={classes.chip}
          />
        </EdgeContainer>
        <PodContainer>{PodList}</PodContainer>
      </Container>
    )
  }
}

export default withStyles(styles)(PipelineSidebar)
