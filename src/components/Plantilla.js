import React, { useState, useRef } from "react";
import { View, PanResponder, Text } from "react-native";
import { withExpoSnack } from "nativewind";
import { styled } from "nativewind";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Definición correcta de StyledView y TextStyled
const StyledView = styled(View);
const StyledText = styled(Text);

export default function Plantilla({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setIsSidebarOpen(true);
        } else if (gestureState.dx < -50) {
          setIsSidebarOpen(false);
        }
      },
    })
  ).current;

  console.log("Children received:", children);

  return (
    <StyledView className="flex-1">
      
      <StyledView className="flex-row flex-1" {...panResponder.panHandlers}>
        {isSidebarOpen && (
          <StyledView className="w-64 h-full bg-primary">
            <Sidebar toggleSidebar={() => setIsSidebarOpen(false)} />
          </StyledView>
        )}
        <StyledView className={`flex-1 bg-black p-4 border-2 border-red-500 ${isSidebarOpen ? 'ml-64' : ''}`}>
          {children }
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
