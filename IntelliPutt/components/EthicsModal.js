import React from 'react'
import { Modal, ScrollView, Text } from 'react-native'

export default function EthicsModal({ vis }) {
    const styles = {
        modal: {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
        },
        modalWrapper: {
            flexGrow: 1,
            height: '10%',
        }
    };
  return (
    <Modal isVisible={ vis } animationIn="slideInUp" animationOut="slideOutDown" className="w-full  ml-0 mb-0 h-[10%]" style={styles.modal}>
        <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white px-[30px] pt-[20px] pb-[40px] rounded-lg w-full">
            <Text className="text-black text-4xl">Lol</Text>
        </ScrollView>
    </Modal>
  )
}

