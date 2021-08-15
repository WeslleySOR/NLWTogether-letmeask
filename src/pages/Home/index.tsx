import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'


import { Flex, Grid, GridItem, Image, Text, Button, FormControl, Input, useColorMode, IconButton } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

export function Home(){
  const { colorMode, toggleColorMode } = useColorMode()
  const history = useHistory();
  const {user, signInWithGoogle} = useAuth()
  const [roomCode, setRoomCode] = useState('')
  async function handleCreateRoom(){    
    if(!user){
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault()

    if(roomCode.trim() === ''){
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()){
      alert('Room does not exists.');
      return;
    }

    if(roomRef.val().endedAt){
      alert('Room already closed');
      return;
    }

    history.push(`/rooms/${roomCode}`);

  }

  return(
      <Grid templateColumns="0.8fr 1fr" h="100vh" bg={colorMode === "light" ? "light.BG" : "dark.BG"}>
        <GridItem colStart={1}>
          <Flex flexDirection="column" alignItems="center" justifyContent="center" w="100%" h="100%" bg={colorMode === "light" ? "light.BGAside" : "dark.BGAside"}>
            <Image src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" maxW="320px"/>
            <Text color={colorMode === "light" ? "light.TextColorSecondary" : "dark.TextColorSecondary"} fontWeight="700" fontSize="3.6rem" fontFamily="Poppins, sans-serif" lineHeight="4.2rem" marginTop="1.6rem">Crie salas de Q&amp;A ao vivo</Text>
            <Text color={colorMode === "light" ? "light.TextColorSecondary" : "dark.TextColorSecondary"} fontSize="2.4rem" lineHeight="3.2rem" marginTop="1.6rem">Tire as dúvidas da sua audiencia em tempo real</Text>
          </Flex>
        </GridItem>
        <GridItem colStart={2} alignSelf="center" justifySelf="center" width="100%" maxW="32rem">
          <Flex flexDirection="column" alignItems="stretch" textAlign="center">
            <IconButton 
                icon={colorMode === "light" ? <SunIcon/>:<MoonIcon/>}
                fontSize="3.2rem"
                variant="unstyled"
                aria-label="Color mode switcher"
                onClick={toggleColorMode}
                transition="0.8s"
                position="absolute"
                right="10"
                top= "0"
                >Switch Mode
            </IconButton>
            <Image src={logoImg} alt="Letmeask" alignSelf="center"/>
            <Button onClick={handleCreateRoom} marginTop="6.4rem" h="5rem" borderRadius="8px" fontWeight="500" background="#ea4335" color="#fff"
            display="flex" justifyContent="center" alignItems="center" cursor="pointer" border="0" transition="filter 0.2s" fontSize= "1.6rem"
            >
              <Image src={googleIconImg} alt="Logo do google" marginRight="0.8rem"
              _hover={{
                filter: "brightness(0.9)",
              }}
              />
              Crie sua sala com o google
            </Button>
            <Flex alignItems="center" margin="32px 0" fontSize="1.4rem" color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"}
            _before={{
              content: '""',
              flex: "1",
              height: "1px",
              background: "#a8a8b3",
              marginRight: "1.6rem"
            }}
            _after={{
              content: '""',
              flex: "1",
              height: "1px",
              background: "#a8a8b3",
              marginLeft: "1.6rem"
            }}
            >Ou entre em uma sala</Flex>
            <form onSubmit={handleJoinRoom}>
              <FormControl>
                <Input 
                  type="text"
                  placeholder="Digite o código da sala"
                  onChange={event=> setRoomCode(event.target.value)}
                  value={roomCode}
                  h="5rem"
                  border= {colorMode === "light" ? "1px solid #121212" : "1px solid #fff"}
                  borderRadius="8px"
                  padding = "0 16px"
                  w="100%"
                  fontSize= "1.6rem"
                  borderColor={colorMode === "light" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)"}
                  _placeholder={{
                    color: `${colorMode === "light" ? "light.TextColor" : "dark.TextColor"}`
                  }}
                />
                <Button 
                  type="submit"
                  marginTop="1.6rem"
                  h="5rem"
                  borderRadius="8px"
                  fontSize= "1.6rem"
                  fontWeight="500"
                  background="#835afd"
                  color="#fff"
                  padding="0 32px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                  border="0"
                  transition="filter 0.2s"
                  w="100%"
                >
                  Entrar na sala
                </Button>
              </FormControl>
            </form>
          </Flex>
        </GridItem>
      </Grid>
  )
}