import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import logoImg from '../../assets/images/logo.svg';
import copyImg from '../../assets/images/copy.svg'
import likeIconImg from '../../assets/images/likeBtn.svg'
import likedIconImg from '../../assets/images/likedBtn.svg'

import { Flex, Grid, GridItem, useColorMode, Text, Textarea, Image, Button, IconButton, Box, FormControl, HStack } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

type RoomParams = {
  id: string;
}

export function Room(){
  const { colorMode, toggleColorMode } = useColorMode()
  const {user} = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewquestion] = useState('');
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  const questionBGColor = (highlighted: boolean , answered: boolean)=>{
    if(colorMode === "light")
    {
      if(!highlighted && !answered)
        return "light.BGSecondary"
      else if(highlighted && !answered)
        return "light.BGHighlighted"
      else if(!highlighted && answered)
        return "light.BGAnswered"
    }
    else if(colorMode === "dark"){
      if(!highlighted && !answered)
        return "dark.BGSecondary"
      else if(highlighted && !answered)
        return "dark.BGHighlighted"
      else if(highlighted && answered)
        return "dark.BGAnswered"
    }
  }

  async function handleSendQuestion(event: FormEvent){
    event.preventDefault();
    if(newQuestion.trim() === ''){
      return;
    }
    if(!user){
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author:{
        name:user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    };
    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewquestion('');
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined){
    if(likeId){
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else{
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id, 
      })
    }
  }

  function copyRoomCodeToClipboard(code: string){
    navigator.clipboard.writeText(code)
  }

  return(
    <Grid templateRows="auto auto">
      <GridItem rowStart={1} padding="1.2rem" borderBottom="1px solid #e2e2e2" maxH="100%">
        <Box marginLeft="4rem" cursor="pointer"  w="fit-content">
          <Link to="/">
            <Image src={logoImg} alt="Lestmeask" h="100%"/>
          </Link>
        </Box>
        <IconButton 
            icon={colorMode === "light" ? <SunIcon/>:<MoonIcon/>}
            fontSize="3rem"
            variant="unstyled"
            aria-label="Color mode switcher"
            onClick={toggleColorMode}
            transition="0.4s"
            position="absolute"
            right="10"
            top= "9"
            >Switch Mode
        </IconButton>
      </GridItem>
      <GridItem rowStart={2}>
        <Grid gridTemplateRows="auto auto 1fr" gridTemplateColumns="1fr 6fr 1fr">
          <GridItem rowStart={1} colStart={2} margin="3.6rem 0 2.4rem">
            <Flex alignItems="center" justifyContent="space-between">
              <HStack spacing={6}>
                <Text fontSize="2.4rem" fontWeight="700" fontFamily="Poppins, sans-serif" color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"}>{title}</Text>
                { questions.length > 0 && <Text marginLeft="1.6rem" background="#e559f9" borderRadius="9999px" padding="8px 16px" fontWeight="500" fontSize="1.4rem" fontFamily="Roboto, sans-serif" color="#fff">{questions.length} pergunta(s)</Text>}
              </HStack>
                <Flex borderRadius="8px" overflow="hidden" bg={colorMode === "light" ? "light.BGSecondary" : "dark.BGSecondary"} border="1px solid #835afd" cursor="pointer">
                  <Button variant="ghost" h="100%" onClick={()=>copyRoomCodeToClipboard(roomId)} padding="0">
                    <Image src={copyImg} alt="Copy room code" padding="12px 12px" bg="#835afd" h="4rem"/>
                    <Text flex="1" padding="0 16px 0 12px" w="24rem" fontSize="1.4rem" fontWeight="500" display="block" alignSelf="center"> Sala {roomId}</Text>
                  </Button>
                </Flex>
            </Flex>
          </GridItem>
          <GridItem rowStart={2} colStart={2}>
            <FormControl>
              <form onSubmit={handleSendQuestion}>
                <Textarea 
                fontSize="1.6rem"
                color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"}
                placeholder="O que voce quer perguntar?"
                _placeholder={{
                  color: `${colorMode === "light" ? "light.TextColor" : "dark.TextColor"}`
                }}
                onChange={event=> setNewquestion(event.target.value)}
                value={newQuestion}
                w="100%"
                border="0"
                padding="1.6rem"
                borderRadius="8px"
                boxShadow="0 2px 12px rgba(0,0,0,0.4)"
                resize="vertical"
                minH="130px"
                />
                <Flex justifyContent="space-between" alignItems="center" marginTop="1.6rem">
                  { user ? (
                    <Flex alignItems="center">
                      <Image src={user.avatar} alt={user.name} w="3.2rem" h="3.2rem" borderRadius="50%"/>
                      <Text marginLeft="0.8rem" fontWeight="500" fontSize="1.4rem">{user.name}</Text>
                    </Flex>
                  ) : (
                    <Text fontSize="1.4rem" fontWeight="500">
                      Para enviar uma pergunta, 
                      <Button background="transparent" border="0" color="#835afd"
                        textDecoration="underline" fontSize="1.4rem" fontWeight="500"
                        cursor="pointer"
                      >
                        faça seu login</Button>
                    </Text>
                  ) }
                  <Flex justifyContent="center" alignItems="center">
                    <Button type="submit" isDisabled={!user}
                    h="5rem"
                    borderRadius="8px"
                    fontSize="1.4rem"
                    fontWeight="500"
                    bg="#835afd"
                    color="#fff"
                    padding="0 32px"
                    opacity={!user ? "0.6": "1"}
                    cursor={user ? "pointer" : "not-allowed"}
                    border="0"
                    transition="0.2s"
                    _hover={{
                      filter: "brightness(0.9)"
                    }}
                    >
                      Enviar pergunta
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </FormControl>
          </GridItem>
          <GridItem rowStart={3} colStart={2} maxH="100%" overflowY="auto" padding="1.2rem 0">
          {questions.map(question =>{
              return(
                <Flex flexDirection="column" bg={questionBGColor(question.isHighlighted, question.isAnswered)}
                _notFirst={{marginTop:"2.4rem"}}
                border={question.isHighlighted && !question.isAnswered ? "1px solid #835afd" : ""}
                borderRadius="8px" boxShadow="0 2px 12px rgba(0, 0, 0, 0.4)" padding="2.4rem" marginTop="3.6rem">
                  <Text color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"} fontSize="1.6rem">- {question.content}</Text>
                  <Flex justifyContent="space-between" alignItems="center" marginTop="2.4rem">
                    <Flex alignItems="center">
                      <Image w="3.2rem" h="3.2rem" borderRadius="50%" src={question.author.avatar} alt={question.author.name}/>
                      <Text marginLeft="0.8rem" color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"} fontSize="1.4rem">{question.author.name}</Text>
                    </Flex>
                    <Flex alignItems="flex-end" gridGap={16}>
                      {!question.isAnswered ?(
                        <Button
                        type="button"
                        aria-label="Marcar como gostei"
                        onClick={() => handleLikeQuestion(question.id, question.likeId)}
                        border="0"
                        background="transparent"
                        cursor="pointer"
                        gridGap={2}
                        >
                          {question.likeCount > 0 && <Text  fontSize="1.4rem">{ question.likeCount }</Text>}
                          {question.likeId ? <Image src={likedIconImg}/> : <Image src={likeIconImg}/>}
                        </Button>
                      )
                      :
                      (
                        <Text color="red.500" fontSize="1.6rem">Respondida</Text>
                      )
                      }
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </GridItem>
        </Grid>
      </GridItem>      
    </Grid>
  );
}