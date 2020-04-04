import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

//import Dropdown from '../../utils/dropdown';
import { Dropdown } from 'react-native-material-dropdown';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [orderBy, setOrderBy] = useState('id');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    let dataDrop = [{
        value: 'name',
        label: 'Name'
      }, {
        value: 'value',
        label: 'Value'
      }, {
        value: 'id',
        label: 'Todos'
    }];

    const navigation = useNavigation();

    function navigationToDetail(incident) {
        navigation.navigate('Details', { incident });
    }

    async function loadIncidents(){
        console.log('entrou no load : ' + orderBy);
        if(loading){
            return;
        }

        if(total > 0 && incidents.length == total){
            return;
        }
        
        setLoading(true);

        const response = await api.get('incidents', {
            params: { page, orderBy }
        });

        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-incident']);
        setPage(page + 1);
        setLoading(false);
    }

    async function setarOrder(value){
        if(value != undefined){
            await setOrderBy(value);
            await setPage(1);
            console.log(orderBy);
            const response = await api.get('incidents', {
                params: { page, orderBy }
            });

            setIncidents([...[], ...response.data]);
            //await loadIncidents();
        }
    }

    this.onChangeText = (value) => {
        setarOrder(value);
    } 

    useEffect(() => {
        loadIncidents();
        setarOrder(undefined);
    }, []);

    return (
        <View style={styles.container} >
            <View style={styles.header} >
                <Image source={logoImg} />
                <Text style={styles.headerText} >
                    Total de <Text style={styles.headerTextBold} >{total} casos.</Text>
                </Text>
            </View>

            <Text style={styles.title} >Bem-vindo!</Text>
            <Dropdown
                label='OrdenarPor'
                data={dataDrop}
                value={orderBy}
                onChangeText={(value) => {this.onChangeText(value)}} 
            />
            <Text style={styles.description} >Escolha um dos casos abaixo e salve o dia.</Text>
        
            <FlatList 
                data={incidents}
                style={styles.incidentList}
                keyExtractor={incident => String(incident.id)}
                //showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident }) => (
                    <View style={styles.incident} >
                        <Text style={styles.incidentProperty} >ONG:</Text>
                        <Text style={styles.incidentValue} >{incident.name}</Text>

                        <Text style={styles.incidentProperty} >CASO:</Text>
                        <Text style={styles.incidentValue} >{incident.title}</Text>

                        <Text style={styles.incidentProperty} >VALOR:</Text>
                        <Text style={styles.incidentValue} >{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</Text>
                    
                        <TouchableOpacity style={styles.detailsButton} onPress={() => navigationToDetail(incident)} >
                            <Text style={styles.detailsButtonText} >Ver mais detalhes</Text>
                            <Feather name='arrow-right' size={16} color='#E02041' />
                        </TouchableOpacity>
                    </View>
                )}
            />
       
        </View>
    );
}