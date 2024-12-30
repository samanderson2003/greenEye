// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const Question = ({ navigation }) => {
//   const questions = [
//     "Is the livestock showing signs of lethargy?",
//     "Is there any loss of appetite?",
//     "Are there any visible sores or lesions?",
//     "Is the animal experiencing difficulty in movement?",
//     "Is there abnormal discharge from the nose or eyes?",
//   ];

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);

//   const handleAnswer = (answer) => {
//     // Create a new array with the current answers plus the new answer
//     const updatedAnswers = [...answers, answer];
    
//     // Update the answers state
//     setAnswers(updatedAnswers);
    
//     // Check if this is the last question
//     if (currentQuestion < questions.length - 1) {
//       // If not the last question, move to the next question
//       setCurrentQuestion((prev) => prev + 1);
//     } else {
//       // If it's the last question, navigate to ChatBot with all answers
//       navigation.navigate('ChatBot', { answers: updatedAnswers });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.question}>{questions[currentQuestion]}</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Yes" onPress={() => handleAnswer('Yes')} />
//         <Button title="No" onPress={() => handleAnswer('No')} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   question: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '60%',
//   },
// });

// export default Question;




import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { auth, db} from '../firebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';

const Question = ({ navigation }) => {
  const [cattle, setCattle] = useState([]);
  const [selectedCattle, setSelectedCattle] = useState(null);
    const [query, setQuery] = useState("");


  const questions = [
    "Diarrhea: Have you noticed any signs of diarrhea (chronic or bloody) in your cattle?",
    "Weight Loss: Are any of your cattle losing weight despite having a normal appetite?",
    "Coat Condition: Does your cattle have a poor or unhealthy coat condition?",
    "Milk Production: Has there been a noticeable reduction in your cattle's milk production?",
    "Fever: Is your cattle showing signs of fever or elevated body temperature?", 
    "Anemia: Do your cattle have pale gums or appear weak and fatigued?", 
    "Lymph Nodes: Are there any visible swellings in the lymph nodes of your cattle?", 
    "Appetite Loss: Has your cattle recently shown a loss of appetite or reduced interest in eating?", 
    "Straining: Have you noticed your cattle straining during defecation or showing signs of discomfort?", 
    "Dehydration: Does your cattle show signs of dehydration, such as sunken eyes or a dry nose?", 
    "Abortion: Has your pregnant cattle experienced abortion recently?", 
    "Neurological Symptoms: Have you observed any neurological symptoms like incoordination or abnormal behavior in your cattle?", 
    "Coordination Issues: Does your cattle lack coordination in movement or appear clumsy?", 
    "Muscle Tremors: Does your cattle show muscle tremors or sensitivity to sound?", 
    "Activity Level: Is your cattle behaving actively and alertly, or does it seem lethargic?", 
  ];

  const [answers, setAnswers] = useState(
    questions.map(() => null)
  );

  const updateAnswer = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const isAllQuestionsAnswered = () => {
    return answers.every(answer => answer !== null);
  };

  const handleContinue = () => {
    // if (isAllQuestionsAnswered()) {
      const formattedAnswers = questions.map((question, index) => ({
        question,
        answer: answers[index]
      }));

      const selectedCattleData = cattle.find((c) => c.id === selectedCattle);

      navigation.navigate("ChatBot", {
        answers: formattedAnswers,
        cattle: selectedCattleData?.id,
        livestockType: selectedCattleData?.cattle, 
        input: query
      });    
    // }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      const cattleRef = collection(doc(db, "users", currentUser.uid), "cattle");
      const unsubscribe = onSnapshot(cattleRef, (querySnapshot) => {
        const fetchedCattle = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setCattle(fetchedCattle);

        if (fetchedCattle.length > 0) {
          setSelectedCattle((prevSelected) => prevSelected || fetchedCattle[0].id);
        }
      });
      return () => unsubscribe();
    }
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
      <Text style={styles.title}>Livestock Health Assessment</Text>
      {cattle.length ? 
        <>  
        {/* Cattle Dropdown */}
        <Text style={styles.label}>Select your Cattle:</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedCattle}
            onValueChange={(itemValue) => setSelectedCattle(itemValue)}
            style={styles.picker}
          >
            {cattle.map((c) => (
              <Picker.Item key={c.id} label={`${c.breed} - ${c.age}yrs ${c.cattle}`} value={c.id} />
            ))}
          </Picker>
        </View>
        </>
      :
        <TouchableOpacity 
        style={[
          styles.continueButton, 
        ]}
        onPress={
          () => {navigation.navigate("AddCattle")}
        }
      >
        <Text style={styles.continueButtonText}>Add Cattle</Text>
      </TouchableOpacity>
      }

        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.answerButtonContainer}>
              <TouchableOpacity 
                style={[
                  styles.answerButton, 
                  answers[index] === 'Yes' && styles.selectedButton
                ]}
                onPress={() => updateAnswer(index, 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.answerButton, 
                  answers[index] === 'No' && styles.selectedButton
                ]}
                onPress={() => updateAnswer(index, 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.answerButton, answers[index] === 'Not Sure' && styles.selectedButton]}
                onPress={() => updateAnswer(index, 'Not Sure')}
              >
                <Text style={styles.buttonText}>Not Sure</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TextInput 
          style={styles.input}
          placeholder="Enter disease or symptoms"
          value={query}
          onChangeText={(text) => setQuery(text)}
          multiline={true}
          numberOfLines={3}
        /> 
        
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            // !isAllQuestionsAnswered() && styles.disabledButton
          ]}
          onPress={handleContinue}
          // disabled={!isAllQuestionsAnswered()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollViewContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    color: '#2c3e50',
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  answerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f5f6f7',
    alignItems: 'center',
  },
  selectedButton: {
    borderWidth: 1,
    borderColor: "#333333"
  },
  buttonText: {
    color: '#333333',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#FCCD2A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer:{
    borderColor: "#cccccc", 
    borderWidth: 1,
    borderRadius: 10, 
    marginBottom: 10
  }, 
  input: {
    height: 120,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    textAlignVertical: "top",
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    fontSize: 16,
    color: "#333",
  },
});

export default Question;