import styled from 'styled-components'
import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'material-ui/Button'
import BiphubLogo from '../assets/biphub-logo.png'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const Header = styled.header`
  display: flex;
  transform: translate3d(0, 0, 0);
  background-color: rgba(253, 253, 253, 0.95);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.17);
  font-size: 0.9rem;
  line-height: 50px;
  height: 50px;
  text-transform: uppercase;
  width: 100%;
  z-index: 102;
`

const LogoImg = styled(Link)`
  padding-left: 10px;
  width: 20%;
  img {
    width: 50px;
    height: 50px;
  }
`

const HeaderNav = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const Nav = styled(Link)`
  color: #999;
  text-decoration: none;
  :active {
    border-bottom: 3px solid #31adb8;
  }
  :hover {
    border-bottom: 3px solid #31adb8;
  }
`

const Main = styled.main`
  flex: 1;
  overflow: hidden;
`

const PrimaryLayout = props => (
  <PageWrapper>
    <Header>
      <LogoImg key="home" to="/">
        <img src={BiphubLogo} alt="Biphub Logo" />
      </LogoImg>
      <HeaderNav>
        <Nav key="primary-nav-pod" to="/pods">
          Pods
        </Nav>
        <Nav key="primary-nav-auth" to="/">
          Auth
        </Nav>
        <Nav key="primary-nav-pipeline" to={{ pathname: 'pipeline' }}>
          <Button raised color="primary">
            Create Pipeline
          </Button>
        </Nav>
      </HeaderNav>
    </Header>
    <Main>{props.routes}</Main>
  </PageWrapper>
)

export default PrimaryLayout
