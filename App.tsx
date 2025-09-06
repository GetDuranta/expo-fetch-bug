import { StatusBar } from 'expo-status-bar';
import { fetch as expoFetch } from "expo/fetch";
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from "react";

async function testFetch(addText: (s: string)=>void) {
  addText("Starting fetch");
  const controller = new AbortController();
  const resp = await expoFetch('https://httpbin.io/drip?numbytes=16&duration=8', {
      signal: controller.signal,
      headers: {
          Accept: 'text/event-stream',
      },
  });

  //setTimeout(() => controller.abort(), 500);

  setTimeout(() => {
    const reader = async () => {
      try {
        const reader = resp.body.getReader();
        while (true) {
          const { done } = await reader.read();
          if (done) {
            break;
          }
          addText("Got a chunk");
        }
      } finally {
        addText("Finished reading");
      }
    };
    void reader();
  }, 1000);
}

export default function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    const adder = (s: string)=> {
      setText((v) => v + "\n" + s)
    }
    void testFetch(adder);
  }, []);

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
