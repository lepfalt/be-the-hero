import React, { Component } from 'react';
import { Dropdown } from 'react-native-material-dropdown';
 
class dropdown extends Component {
  render() {
    let data = [{
      value: 'name',
      label: 'Name'
    }, {
      value: 'value',
      label: 'Value'
    }, {
      value: 'id',
      label: 'Todos'
    }];
 
    return (
      <Dropdown
        label='OrdenarPor'
        data={data}
        onChangeText={(value)=> {this.orderBy({
            value
        });}}   
      />
    );
  }
}
export default dropdown;