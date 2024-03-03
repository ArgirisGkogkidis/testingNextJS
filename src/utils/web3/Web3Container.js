import React from 'react'
import getWeb3 from './getWeb3'
import getContract from './getContract'
import trackingDefinition from '../contracts/Tracking.json'
import managementDefinition from '../contracts/Management.json'
import axios from 'axios'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, tracking: null, management: null, isadmin: false, open: false, message: "", hasaccount: false, user: {} };

  async componentDidMount() {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const tracking = await getContract(web3, trackingDefinition)
      const management = await getContract(web3, managementDefinition)
      const isadmin = await management.methods.isAdmin(accounts[0]).call()

      const data = await axios.get('http://127.0.0.1:4000/api/v1/', { params: { wallet: accounts[0] } });
      const hasaccount = data.data.data.user.length == 1
      const user = data.data.data.user[0]
      this.setState({ web3, accounts, tracking, management, isadmin, hasaccount, user })
    } catch (error) {
      this.setState({ open: true, message: `Failed to load web3, accounts, or contract. Check console for details.` })
      console.log(error)
    }
  }

  render() {
    const { web3, accounts, tracking, management, isadmin, open, message, hasaccount, user } = this.state
    return web3 && accounts
      ? this.props.render({ web3, accounts, tracking, management, isadmin, hasaccount, user })
      : this.props.renderLoading({ open, message })
  }
}
