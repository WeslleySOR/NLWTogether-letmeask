import { Link, useHistory, useParams } from 'react-router-dom';

import { database } from '../../services/firebase';

import { useRoom } from '../../hooks/useRoom';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'
import copyImg from '../../assets/images/copy.svg'

import { Flex, Grid, GridItem, useColorMode, Image, Box, Button, Text, IconButton, HStack } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';


type RoomParams = {
  id: string;
}

export function AdminRoom(){
  const { colorMode, toggleColorMode } = useColorMode()
  const history = useHistory();
  const params = useParams<RoomParams>();
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
  
  function copyRoomCodeToClipboard(code: string){
    navigator.clipboard.writeText(code)
  }

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }
  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }


  return(
    <Grid templateRows="auto auto">
      <GridItem rowStart={1} padding="1.2rem" borderBottom="1px solid #e2e2e2" maxH="100%">
        <Box marginLeft="4rem" cursor="pointer" w="fit-content">
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
        <Grid templateColumns="1fr 6fr 1fr" templateRows="1fr auto">
          <GridItem rowStart={1} colStart={2} margin="32px 0 24px">
            <Flex alignItems="center" justifyContent="space-between">
              <HStack spacing={6}>
                <Text fontFamily="Poppins, sans-serif" fontSize="2.4rem" fontWeight="700" color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"}>{title}</Text>
                { questions.length > 0 && <Text marginLeft="16px" bg="#e559f9" borderRadius="9999px" padding="8px 16px" color="#fff" fontWeight="500" fontSize="1.4rem">{questions.length} pergunta(s)</Text>}
              </HStack>
              <HStack spacing={6}>
                <Flex borderRadius="8px" overflow="hidden" bg={colorMode === "light" ? "light.BGSecondary" : "dark.BGSecondary"} border="1px solid #835afd" cursor="pointer">
                  <Button variant="ghost" h="100%" onClick={()=>copyRoomCodeToClipboard(roomId)} padding="0">
                    <Image src={copyImg} alt="Copy room code" padding="12px 12px" bg="#835afd" h="4rem"/>
                    <Text flex="1" padding="0 16px 0 12px" w="24rem" fontSize="1.4rem" fontWeight="500" display="block" alignSelf="center"> Sala {roomId}</Text>
                  </Button>
                </Flex>
                <Button onClick={handleEndRoom} marginRight="12rem" h="4rem" borderRadius="8px" fontWeight="500" background="transparent" color="#835afd"
                  display="flex" justifyContent="center" alignItems="center" cursor="pointer" border="1px solid #835afd" transition="filter 0.2s" fontSize= "1.6rem"
                >Encerrar Sala</Button>
              </HStack>
            </Flex>
          </GridItem>
          <GridItem rowStart={2} colStart={2} marginTop="32px">
          {questions.map(question =>{
            return(
              <Flex flexDirection="column" bg={questionBGColor(question.isHighlighted, question.isAnswered)}
              _notFirst={{marginTop:"2.4rem"}}
              border={question.isHighlighted && !question.isAnswered ? "1px solid #835afd" : !question.isHighlighted && question.isAnswered ? "1px solid #F8485E" : ""}
              borderRadius="8px" boxShadow="0 2px 12px rgba(0, 0, 0, 0.4)" padding="2.4rem" marginTop="3.6rem">
                <Text color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"} fontSize="1.6rem">- {question.content}</Text>
                <Flex justifyContent="space-between" alignItems="center" marginTop="2.4rem">
                  <Flex alignItems="center">
                    <Image w="3.2rem" h="3.2rem" borderRadius="50%" src={question.author.avatar} alt={question.author.name}/>
                    <Text marginLeft="0.8rem" color={colorMode === "light" ? "light.TextColor" : "dark.TextColor"} fontSize="1.4rem">{question.author.name}</Text>
                  </Flex>
                  <Flex alignItems="flex-end" gridGap={16}>
                    {!question.isAnswered ?
                      <>
                      <Button
                      type="button"
                      variant="unstyled"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <Image src={checkImg} alt="Marcar pergunta como respondida"/>
                      </Button>

                      <Button
                      type="button"
                      variant="unstyled"
                      onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <Image src={answerImg} alt="Dar destaque à pergunta"/>
                      </Button>
                    </>
                    :
                    <Text color="#F8485E" fontSize="1.6rem" fontWeight="700">Respondida</Text>
                    }
                    <Button
                        type="button"
                        variant="unstyled"
                        onClick={() => handleDeleteQuestion(question.id)}
                        >
                        <Image src={deleteImg} alt="Remover pergunta"/>                        
                    </Button>
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