import { View } from "@/src/components/Themed"
import { supabase } from "@/src/lib/supabase";
import { Button, Text } from "react-native"

const ProfileScreen = () => {
    return (
        <View>
            <Text>Profile</Text>
            <Button title="Sign out" onPress={async () => await supabase.auth.signOut()}/>
        </View>
    )
}

export default ProfileScreen;