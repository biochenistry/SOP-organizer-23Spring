import { Colors } from "../components/GlobalStyles";
import Heading from "../components/Heading/Heading";
import View from "../components/View/View";

export default function Home() {
  return (
    <View container alignItems='center' justifyContent='center' width='100%' >
      <Heading renderAs='h2' text='Select a file in the sidebar to view.' color={Colors.textSecondary} />
    </View>
  );
}