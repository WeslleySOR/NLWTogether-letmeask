import { useState, FormEvent } from 'react'

import { Link, useHistory } from 'react-router-dom'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'

import { database } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'


import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { Flex, Grid, GridItem, Image, Text, Button, FormControl, Input, useColorMode, IconButton } from '@chakra-ui/react'

export function NewRoom(){
  const { colorMode, toggleColorMode } = useColorMode()
  const { user } = useAuth()
  const history = useHistory()
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent){  
    event.preventDefault();
  
    if(newRoom.trim() === ''){
      return;
    }
    const roomRef = database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`)

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
            <Text fontSize="2.4rem" margin="64px 0 24px" fontFamily="Poppins, sans-serif">Crie uma nova sala</Text>
            <form onSubmit={handleCreateRoom}>
              <FormControl>
                <Input 
                  type="text"
                  placeholder="Nome da sala"
                  onChange={event => setNewRoom(event.target.value)}
                  value={newRoom}
                  h="5rem"
                  border= {colorMode === "light" ? "1px solid #121212" : "1px solid #fff"}
                  borderRadius="8px"
                  padding = "0 16px"
                  w="100%"
                  fontSize= "1.6rem"
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
                  Criar sala
                </Button>
              </FormControl>
            </form>
            <Text fontSize="1.4rem" color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"} marginTop="1.6rem">
              Quer entrar em uma sala já existente? &nbsp;
            <Link to="/" style={{ color: `${colorMode === "light" ? "#e559f9" : "#e559f9"}` }}>Clique aqui</Link>
            </Text>
          </Flex>
        </GridItem>
      </Grid>
  )
}