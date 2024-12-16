import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const HomeScreen = ({ onStart, onStop, timer, isRunning, onPause, onResume }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./1-22.png')} />
      <Text style={styles.title}>Добро пожаловать в трекер учебы!</Text>
      <Text style={styles.timer}>{timer} секунд</Text>
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={onStart}>
            <Text style={styles.buttonText}>Начать учиться</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={onStop}>
              <Text style={styles.buttonText}>Завершить задачу</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onPause}>
              <Text style={styles.buttonText}>Поставить на паузу</Text>
            </TouchableOpacity>
          </>
        )}
        {!isRunning && timer > 0 && (
          <TouchableOpacity style={styles.button} onPress={onResume}>
            <Text style={styles.buttonText}>Продолжить</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const JournalScreen = ({ entries, totalTime, dailyGoal, onDeleteEntry }) => {
  const isGoalMet = totalTime >= dailyGoal;
  const data = [
    {
      name: 'Отучился',
      population: totalTime,
      color: '#09D382',
      legendFontColor: '#ffffff',
      legendFontSize: 14,
    },
    {
      name: 'Осталось',
      population: dailyGoal - totalTime > 0 ? dailyGoal - totalTime : 0,
      color: '#913A3A',
      legendFontColor: '#ffffff',
      legendFontSize: 14
    },
  ];

  return (
    <View style={styles.container}>
      <Image source={require('./1-21.png')} />
      <Text style={styles.title}>Мой чилловый дневник</Text>
      <FlatList
        data={entries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.entryContainer}>
            <Text style={styles.entry}>{item} сек</Text>
            <TouchableOpacity onPress={() => onDeleteEntry(index)}>
              <Text style={styles.deleteButton}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Всего: {totalTime} сек</Text>
      <Text style={[styles.goalStatus, isGoalMet ? styles.goalMet : styles.goalNotMet]}>
        {isGoalMet ? 'Заданное время учебы выполнено!' : 'Заданное время учебы не выполнено!'}
      </Text>
      <PieChart
        data={data}
        width={300}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => {
            return 'rgba(0, 0, 0, ' + opacity + ')';
          },
          labelColor: (opacity = 1) => {
            return 'rgba(0, 0, 0, ' + opacity + ')';
          },
          strokeWidth: 2,
          barPercentage: 0.5,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft='24'
        paddingRight='24'
        absolute
      />
    </View>
  );
};

const App = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [showJournal, setShowJournal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(0);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
      setEntries(prevEntries => [...prevEntries, timer]);
      setTimer(0);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  const resumeTimer = () => {
    if (!isRunning) {
      startTimer();
    }
  };

  const toggleJournal = () => {
    setShowJournal(!showJournal);
  };

  const totalTime = entries.reduce((acc, curr) => acc + curr, 0);

  const deleteEntry = (index) => {
    setEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {showJournal ? (
        <>
          <JournalScreen 
            entries={entries} 
            totalTime={totalTime} 
            dailyGoal={dailyGoal}
            onDeleteEntry={deleteEntry} 
          />
          <TouchableOpacity style={styles.journalButton} onPress={toggleJournal}>
            <Text style={styles.journalButtonText}>Обратно к таймеру</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <HomeScreen
            onStart={startTimer}
            onStop={stopTimer}
            timer={timer}
            isRunning={isRunning}
            onPause={pauseTimer}
            onResume={resumeTimer}
          />
          <TextInput
            style={styles.goalInput}
            placeholder="Введите сколько планируете учиться (в секундах)"
            keyboardType="numeric"
            value={dailyGoal.toString()}
            onChangeText={(text) => setDailyGoal(Number(text))}
          />
          <TouchableOpacity style={styles.journalButton} onPress={toggleJournal}>
            <Text style={styles.journalButtonText}>Перейти в Мой Дневник</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#336853',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 48,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3A916E',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  journalButton: {
    backgroundColor: '#3A916E',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  journalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  entryContainer: {
    flex: 1,
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90vw',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    marginBottom: 10,
  },
  entry: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  deleteButton: {
    color: '#3A916E',
    fontSize: 16,
  },
  total: {
    color: '#FFFFFF',
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
  goalMet: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 0,
    fontWeight: 'bold',
  },
  goalNotMet: {
    color: '#fffff',
    fontSize: 16,
    marginTop: 0,
    fontWeight: 'bold',
  },
  goalInput: {
    width: '100%',
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'none',
    borderColor: '#ffffff',
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    marginTop: 0,
    width: '100%',
  }
});

export default App;
