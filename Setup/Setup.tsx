import React from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import uuid from 'react-native-uuid';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PlayerDataKey } from '../asyncStorage/AsyncConstants';
import { mockData, PlayerPreference, Position, Team } from './types';


export const SetupScreen = () => {
  const [playerData, setPlayerData] = React.useState<PlayerPreference[]>(mockData);
  const [playerPreferences, setPlayerPreferences] = React.useState<PlayerPreference[]>([]);
  const [selectedPlayer, setSelectedPlayer] = React.useState(playerData[0]);
  const [selectedPosition, setSelectedPosition] = React.useState<Position>(Position.Skip);
  const [refresh, setRefresh] = React.useState(false);
  const [showTeams, setShowTeams] = React.useState(false);
  const [maxSheets, setMaxSheets] = React.useState(4);

  const handlePlayerChange=(itemValue: string) => {
    setSelectedPlayer(playerData.find(player => player.id === itemValue));
  }

  const handlePositionChange=(position: string) => {
    setSelectedPosition(position);
  }

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

  const playerIsInGame = playerPreferences.some(preference => preference.id === selectedPlayer.id);
  
  return (
    <>
      {!showTeams ? (
        <View style={[styles.container, styles.row]}>
          <SelectPlayers 
            addPlayerToGame={addPlayerToGame}
            handlePlayerChange={handlePlayerChange}
            handlePositionChange={handlePositionChange}
            playerData={playerData} 
            playerIsInGame={playerIsInGame}
            selectedPlayer={selectedPlayer} 
            selectedPosition={selectedPosition}
            maxSheets={maxSheets}
            setMaxSheets={setMaxSheets}
          />
          <PlayersInGame 
            playerIsInGame={playerIsInGame}
            playerPreferences={playerPreferences} 
            refresh={refresh}
            removePlayerFromGame={removePlayerFromGame}
            setShowTeams={setShowTeams}
          />
        </View>
      ): (
        <TeamsView maxSheets={maxSheets} playerPreferences={playerPreferences} showTeams={showTeams} setShowTeams={setShowTeams} />
      )}
    </>
  )
};

const SelectPlayers = ({ addPlayerToGame, handlePlayerChange, handlePositionChange, playerData, playerIsInGame, selectedPlayer, selectedPosition, maxSheets, setMaxSheets }) => {

  return (
    <View style={styles.selectPlayers}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}> Add Player & Position</Text>
      </View>
      <View style={styles.innerContainer}>
        <Picker 
          style={{ backgroundColor: 'white', padding: 10, width: '100%'}}
          selectedValue={selectedPlayer?.id}
          onValueChange={handlePlayerChange}>
          {playerData.map((player) => (<Picker.Item label={`${player.firstName} ${player.lastName}`} key={player.id} value={player.id}/>))}
        </Picker>
      </View>
      <View style={styles.positionsContainer}>
        {getPositionStrings().map((key, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => handlePositionChange(key)}
            style={styles.button}
          >
            <Text style={[styles.buttonText, { color: key === selectedPosition ? 'firebrick' : '#007AFF'}]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity style={[styles.wideButton, styles.button]} onPress={addPlayerToGame}>
          <Text style={styles.buttonText}>{playerIsInGame ? "Update" : "Submit"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.playerText}>Max Sheets: </Text>
        <TextInput style={styles.playerText} value={maxSheets.toString()} onChangeText={setMaxSheets} keyboardType='numeric'/>
      </View>
    </View>
  )
};

const PlayersInGame = ({playerIsInGame, playerPreferences, refresh, removePlayerFromGame, setShowTeams}) => {
  return (
    <View style={styles.playersInGame}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Players In Game</Text>
      </View>
      <FlatList 
        style={styles.innerContainer}
        data={playerPreferences} 
        extraData={refresh}
        renderItem={({item}) => (<Text key={item.id} style={styles.playerText}>{`${item.firstName} ${item.lastName}: ${item.position}`}</Text>)}/>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {playerIsInGame && (
          <TouchableOpacity style={[styles.wideButton, styles.button]} onPress={removePlayerFromGame}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.wideButton, styles.button]} onPress={() => setShowTeams(true)}>
            <Text style={styles.buttonText}>Generate Teams</Text>
          </TouchableOpacity>
      </View>
    </View>

  )
};

const TeamsView = ({maxSheets, playerPreferences, showTeams, setShowTeams }) => {
  const [teams, setTeams] = React.useState([]);
  const [sheets, setSheets] = React.useState(0);
  const [remainders, setRemainders] = React.useState([]);
  const skips: PlayerPreference[] = [];
  const vices: PlayerPreference[] = [];
  const seconds: PlayerPreference[] = [];
  const leads: PlayerPreference[] = [];
  const mutableTeams: Team[] = [];

  React.useEffect(() => {
      const total = playerPreferences.length;
  
      if(total % 8 === 0 || total % 8 >= 6) {
        setSheets(Math.min(maxSheets, Math.ceil(total / 8)));
      } else {
        setSheets(Math.min(maxSheets, Math.floor(total / 6)));
      }
    }, [playerPreferences, showTeams]);

  React.useEffect(() => {
    const assignPlayers = () => {
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
      assignRemainders();
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

    const assignRemainders = () => {
      const mutableRemainders: PlayerPreference[] = [];
      mutableRemainders.push(...skips);
      mutableRemainders.push(...vices);
      mutableRemainders.push(...seconds);
      mutableRemainders.push(...leads);
      setRemainders(mutableRemainders);
    }
  
    const getRandomPlayer = (players) => {
      const randomPlayer = players[Math.floor(Math.random()*players.length)];
      const index = players.findIndex(player => player.id === randomPlayer.id);
      if(index > -1) {
        players.splice(index, 1);
      }
      return randomPlayer;
    }

    assignPlayers();
  }, [playerPreferences, sheets]);

  const getSheets = () => {
    const sheetElements: any = [];
    for(var i = 1; i <= sheets; i++){
      const sheetTeams = teams.filter(team => { return team.sheet === i});
      sheetElements.push((<SheetView sheetKey={`sheet-${i}`} sheetNumber={i} teamOne={sheetTeams[0]} teamTwo={sheetTeams[1]}/>))
    }
    return sheetElements;
  }

  const getRemainders = () => {
    return !!remainders.length ? (
      <>
        <Text style={styles.headerText}>Remainders: - fill in for absent League members, or join a sheet as an alternate</Text>
        {remainders.map(remainder => (<Text style={styles.playerText}>{remainder.firstName} {remainder.lastName}</Text>))}
      </>
    ) : null;
  }

  return (
    <View>
      {/* {teams.map((team, index) => (<Text style={styles.playerText} key={`team-${index}`}>{index % 2 == 0 ? getFirstTeamText(team) : getOpponentTeamText(team)}</Text>))} */}
      <View style={styles.row}>
        {getSheets()}
      </View>
      {getRemainders()}
      <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity style={[styles.button, styles.wideButton]} onPress={() => setShowTeams(false)}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const SheetView = ({sheetKey, teamOne, teamTwo, sheetNumber}) => {
  return (
    <View key={sheetKey} style={styles.innerContainer}>
       <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sheet {sheetNumber}</Text>
        <Text style={styles.playerText}>{getTeamText(teamOne)}</Text>
        <Text style={styles.playerText}>Vs.</Text>
        <Text style={styles.playerText}>{getTeamText(teamTwo)}</Text>
      </View>
    </View>
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

const getTeamText = (team) => {
  return `${getNameByPosition(Position.Skip.toString(), team)}
    ${getNameByPosition(Position.Vice.toString(), team)}
    ${getNameByPosition(Position.Second.toString(), team)}
    ${getNameByPosition(Position.Lead.toString(), team)}`;
}

const getNameByPosition = (position, team) => {
  return team && team[position] ? `${team[position]?.firstName} ${team[position]?.lastName}` : '';
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row'
  },
  selectPlayers: {
    flex: 2,
  },
  playersInGame: {
    flex: 3
  },
  headerContainer: {
    backgroundColor: 'white',
    margin: 10, 
    padding: 20
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  innerContainer: {
    margin: 10
  },
  positionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#007AFF',
    padding: 20
  },
  buttonText: {
    fontSize: 24,
    color: '#007AFF'
  },
  wideButton: { 
    paddingLeft: 45, 
    paddingRight: 45, 
    marginRight: 20 
  },
  playerText: {
    fontSize: 24,
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