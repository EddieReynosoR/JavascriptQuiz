import {Card, Typography, List, ListItem, ListItemButton, ListItemText, Stack, IconButton} from '@mui/material'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { useQuestionsStore } from './store/questions'
import { Question as QuestionType } from './types/types'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Footer } from './Footer'

import {atelierForestDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'


const Question = ({info} : {info:QuestionType}) => {
    const selectAnswer = useQuestionsStore(state => state.selectAnswer)

    const createHandleClick = (info:QuestionType, answerIndex: number) => () => {
        selectAnswer(info.id, answerIndex)
    }

    const getBackgroundColor = (index:number) => {
        const {userSelectedAnswer, correctAnswer} = info

        console.log(userSelectedAnswer)

        // Usuario no ha seleccionado nada
        if(userSelectedAnswer === null || userSelectedAnswer === undefined) return 'transparent'

        // Si ya selecciono pero la respuesta es incorrecta
        if(index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'

        // Si es la respuesta correcta
        if(index === correctAnswer) return 'green'

        // Si la seleccion del usuario es incorrecta
        if(index === userSelectedAnswer) return 'red'


        // Si no es ninguna de las anteriores
        return 'transparent'
    }
    return(
        <Card variant='outlined' sx={{bgColor: '#222', padding:2, textAlign: 'left', marginTop: '10px'}}>
            <Typography variant='h5'>
                {
                    info.question
                }
            </Typography>

            <SyntaxHighlighter language='javascript' style={atelierForestDark}>
                {info.code}
            </SyntaxHighlighter>

            <List sx={{bgColor: '#333', textAlign: 'center'}} disablePadding>
                {
                    info.answers.map((answer, index) => {
                        return(
                            <ListItem key={index} disablePadding divider>
                                <ListItemButton
                                disabled={info.userSelectedAnswer !== undefined} 
                                onClick={createHandleClick(info, index)}
                                sx={{
                                    backgroundColor: getBackgroundColor(index)
                                }}
                                >
                                    <ListItemText primary={answer} sx={{textAlign: 'center'}}/>
                                </ListItemButton>
                            </ListItem>
                        )
                    })
                }
            </List>
        </Card>
    )
}
export const Game = () => {
    const questions = useQuestionsStore(state => state.questions)
    const currentQuestion = useQuestionsStore(state => state.currentQuestion)
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)
    const goPrevQuestion = useQuestionsStore(state => state.goPrevQuestion)

    const questionInfo = questions[currentQuestion]

    return (
        <>
            <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
                <IconButton onClick={goPrevQuestion} disabled={currentQuestion === 0}>
                    <ArrowBackIosNew/>
                </IconButton>
                {currentQuestion + 1} / {questions.length}
                <IconButton onClick={goNextQuestion} disabled={currentQuestion >= questions.length - 1}>
                    <ArrowForwardIos/>
                </IconButton>
            </Stack>
            <Question info={questionInfo}/>
            <Footer/>
        </>
    )
}