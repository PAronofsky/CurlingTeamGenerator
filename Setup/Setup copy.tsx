import React from 'react';
import { Button, FlatList, TextInput, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import uuid from 'react-native-uuid';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PlayerDataKey } from '../asyncStorage/AsyncConstants';
import { mockData, PlayerPreference, Position } from './types';


export const SetupScreenCopy = () => {
  // const playerData = AsyncStorage.getItem(PlayerDataKey);
  const [playerData, setPlayerData] = React.useState<PlayerPreference[]>(mockData);
  const [playerPreferences, setPlayerPreferences] = React.useState<PlayerPreference[]>(mockData);
  const [selectedPlayer, setSelectedPlayer] = React.useState(playerData[0]);
  const [selectedPosition, setSelectedPosition] = React.useState<Position>(Position.Skip);
  const [refresh, setRefresh] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [newPlayerFirstName, setNewPlayerFirstName] = React.useState('');
  const [newPlayerLastName, setNewPLayerLastName] = React.useState('');
  const [teams, setTeams] = React.useState([]);

  const skips = [];
  const vices = [];
  const seconds = [];
  const leads = [];
  const mutableTeams = [];

  const addPlayerToGame = () => {
    const preferences = playerPreferences;
    const index = preferences.findIndex(preference => preference.id === selectedPlayer.id);
    if(index > -1){
      preferences[index].position = selectedPosition;
      setPlayerPreferences(preferences);
      setRefresh(!refresh);
    } else {
      preferences.push({
        ...selectedPlayer,
        position: selectedPosition
      });
      setPlayerPreferences(preferences);
      setRefresh(!refresh);
    }
  }

  const removePlayerFromGame = () => {
    const preferences = playerPreferences.filter(preference => preference.id !== selectedPlayer.id);
    setPlayerPreferences(preferences);
    setRefresh(!refresh);
  }

  const handlePlayerChange=(itemValue: string) => {
    setSelectedPlayer(playerData.find(player => player.id === itemValue));
  }

  const handlePositionChange=(position: string) => {
    setSelectedPosition(position);
  }

  const openModal = () => {
    setIsModalVisible(true);
  }

  const closeModal = () => {
    setNewPlayerFirstName('');
    setNewPLayerLastName('');
    setIsModalVisible(false);
  }

  const addPlayerToList = () => {
    if(newPlayerFirstName && newPlayerLastName) {
      let data = playerData;
      const newPlayer = {
        id: uuid.v4(),
        firstName: newPlayerFirstName,
        lastName: newPlayerLastName
      };
      data.push(newPlayer);
      setPlayerData(data);
      setSelectedPlayer(newPlayer);
    }
    
    closeModal();
  }

  const generateTeams = () => {
    const total = playerPreferences.length;

    let sheets = 4;
    if(total % 8 === 0 || total % 8 >= 6) {
      sheets = Math.ceil(total / 8);
    } else {
      sheets = Math.floor(total / 6);
    }

    assignPlayers(sheets);
  }

  const assignPlayers = (sheets: number) => {
    const totalTeams = sheets * 2;

    playerPreferences.forEach(preference => {
      switch(preference.position){
        case Position.Skip:
          skips.push(preference);
          break;
        case Position.Vice:
          vices.push(preference);
          break;
        case Position.Second:
          seconds.push(preference);
          break;
        default:
          leads.push(preference);
          break;
      }
    });

    assignSkips(totalTeams);
    assignTeammates(Position.Vice);
    assignTeammates(Position.Second);
    assignTeammates(Position.Lead);
    setTeams(mutableTeams);
  }

  const assignSkips = (totalTeams) => {
    for(var i = 1; i <= totalTeams; i++) {
      const skip = skips.length ? getRandomPlayer(skips) : 
                   vices.length ? getRandomPlayer(vices) : 
                   seconds.length ? getRandomPlayer(seconds) : 
                   leads.length ? getRandomPlayer(leads) : 
                   null;
      mutableTeams.push({
        sheet: Math.ceil(i/2),
        [Position.Skip]: skip,
        [Position.Vice]: undefined,
        [Position.Second]: undefined,
        [Position.Lead]: undefined
      });
    }
  }

  const assignTeammates = (position) => {
    mutableTeams.forEach(team => {
      const player = skips.length ? getRandomPlayer(skips) : 
      vices.length ? getRandomPlayer(vices) : 
      seconds.length ? getRandomPlayer(seconds) : 
      leads.length ? getRandomPlayer(leads) : 
      null;

      team[position] = player;
    });
  }

  const getRandomPlayer = (players) => {
    const randomPlayer = players[Math.floor(Math.random()*players.length)];
    const index = players.findIndex(player => player.id === randomPlayer.id);
    if(index > -1) {
      players.splice(index, 1);
    }
    return randomPlayer;
  }
  
  const playerIsInGame = playerPreferences.some(preference => preference.id === selectedPlayer.id);
  return (
    <SafeAreaView >
      <Text>Enter Names and desired positions</Text>
      <Button title="Add Player" onPress={openModal}/>
      <Picker 
        selectedValue={selectedPlayer?.id}
        onValueChange={handlePlayerChange}>
        {playerData.map((player) => (<Picker.Item label={`${player.firstName} ${player.lastName}`} key={player.id} value={player.id}/>))}
      </Picker>
      <View style={styles.row}>
        {getPositionStrings().map((key, index) => (<Button title={key} key={index} color={key === selectedPosition ? 'firebrick' : '#007AFF'} onPress={() => handlePositionChange(key)}/>))}
      </View>
      <View style={styles.row}>
        <Button title={playerIsInGame ? "Update" : "Submit"} onPress={addPlayerToGame}/>
        {playerIsInGame && <Button title="Remove" onPress={removePlayerFromGame}/>}
      </View>
      <FlatList 
        data={playerPreferences} 
        extraData={refresh}
        renderItem={({item}) => (<Text key={item.id}>{`${item.firstName} ${item.lastName}: ${item.position}`}</Text>)}/>
      <Button title="Generate Teams" onPress={generateTeams}/>
      <View>
        {teams.map((team, index) => (<Text key={`${team}-${index}`}>{index % 2 == 0 ? getFirstTeamText(team) : getOpponentTeamText(team)}</Text>))}
      </View>
      <Modal
        isVisible={isModalVisible}
        avoidKeyboard
        hasBackdrop
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
      >
        <View style={styles.modal}>
          <View style={styles.row}>
            <TextInput style={styles.input} placeholder="First Name" value={newPlayerFirstName} onChangeText={setNewPlayerFirstName}/>
            <TextInput style={styles.input} placeholder="Last Name"  value={newPlayerLastName} onChangeText={setNewPLayerLastName}/>
          </View>
          <Button title="Submit" onPress={addPlayerToList}/>
        </View>
      </Modal>
    </SafeAreaView>
  )
};

const getPositionStrings = () => {
  return Object.keys(Position).filter(value => isNaN(Number(value)) === true);
}

const getFirstTeamText = (team) => {
  return `Sheet ${team.sheet}: ${team[Position.Skip]?.firstName} ${team[Position.Skip]?.lastName}, 
            ${team[Position.Vice]?.firstName} ${team[Position.Vice]?.lastName}, 
            ${team[Position.Second]?.firstName} ${team[Position.Second]?.lastName}, 
            ${team[Position.Lead]?.firstName} ${team[Position.Lead]?.lastName}.`
}

const getOpponentTeamText = (team) => {
  return `vs ${team[Position.Skip]?.firstName} ${team[Position.Skip]?.lastName}, 
  ${team[Position.Vice]?.firstName} ${team[Position.Vice]?.lastName}, 
  ${team[Position.Second]?.firstName} ${team[Position.Second]?.lastName}, 
  ${team[Position.Lead]?.firstName} ${team[Position.Lead]?.lastName}.`
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  row: { 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  input: { 
    flex: 1,
    margin: 10
  },
  modal: {
    backgroundColor: 'white',
    padding: 40,
    width: 450,
    alignItems: 'center', 
    justifyContent: 'center'
  }
})