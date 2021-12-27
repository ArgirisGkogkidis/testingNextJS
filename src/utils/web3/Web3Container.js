import React from 'react'
import getWeb3 from './getWeb3'
import getContract from './getContract'
import trackingDefinition from '../contracts/Tracking.json'
import managementDefinition from '../contracts/Management.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, tracking: null, management: null, isadmin: false };

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const tracking = await getContract(web3, trackingDefinition)
      const management = await getContract(web3, managementDefinition)
      const isadmin = await management.methods.isAdmin(accounts[0]).call()

      this.setState({ web3, accounts, tracking, management, isadmin })

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      alert(error)
      console.log(error)
    }
  }

  render () {
    const { web3, accounts, tracking, management, isadmin } = this.state
    return web3 && accounts
      ? this.props.render({ web3, accounts, tracking, management, isadmin })
      : this.props.renderLoading()
  }
}
