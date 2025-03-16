import { useState } from "react"
import { TextInput, StyleSheet, Text } from "react-native";

type TipSelectionProps = {
    onTipChange: (tip: number) => void;
};

const TipSelection = ({ onTipChange }: TipSelectionProps) => {
    const [customTip, setCustomTip] = useState('');

    const handleTipChange = (value: string) => {
        const numericTip = parseFloat(value) || 0;
        setCustomTip(value);
        onTipChange(numericTip);
    };

    return (
        <>
            <Text style={{marginTop: 10}}>Tip your delivery driver!</Text>
            <TextInput placeholder="Custom Tip" keyboardType="numeric" value={customTip} onChangeText={handleTipChange} style={styles.tip}/>
        </>
    )
}

const styles = StyleSheet.create({
    tip: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 5,
    }
})

export default TipSelection;