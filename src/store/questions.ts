import {create} from 'zustand'

// Hacer algo cada vez que haya un cambio en el estado
import { persist } from 'zustand/middleware';
import { Question } from './../types/types.d';
import { getAllQuestions } from '../services/questions';

// Describir como se compondrá el estado
interface State {
    questions: Question[]
    currentQuestion: number
    fetchQuestions: (limit: number) => Promise<void>
    selectAnswer: (questionId: number, answerIndex: number) => void
    goNextQuestion: () => void
    goPrevQuestion: () => void
    reset: () => void
}

// CREAR MIDDLEWARE EN ZUSTAND

// const logger = (config) => (set,get,api) => {
//     return config(
//         (...args) => {
//             console.log('applying', args)
//             set(...args) // original
//             console.log('new state'. get())
//         },
//         get,
//         api
//     )
// }

export const useQuestionsStore = create<State>()(persist((set, get) => {
    // get (leer estado) - set (actualizar estado)
    return {
        questions: [],
        currentQuestion: 0, // posicion del arrray de Questions

        fetchQuestions: async (limit: number) => {
            const questions = await getAllQuestions(limit)

            set({questions})
        },

        selectAnswer: (questionId:number, answerIndex: number) => {
            const {questions} = get() // Recuperar valor del estado
            // usar el structuredClone para clonar el objeto
            // Copiar todas las preguntas, para cambiar solo la que se ha respondido
            const newQuestions = structuredClone(questions)
            
            // Obtener index de la pregunta
            const questionIndex = newQuestions.findIndex(question => question.id === questionId)

            // Obtener datos de la pregunta
            const questionInfo = newQuestions[questionIndex]

            // Checar si la respuesta es correcta
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex

            // Cambiar la información en la copia de la pregunta
            newQuestions[questionIndex] = {
                ...questionInfo,
                isCorrectUserAnswer,
                userSelectedAnswer: answerIndex
            }
            // Actualizar estado
            set({questions: newQuestions})

        },

        goNextQuestion: () => {
            const {currentQuestion, questions} = get()

            const nextQuestion = currentQuestion + 1

            if(nextQuestion < questions.length) {
                set({currentQuestion: nextQuestion})
            }
        },

        goPrevQuestion: () => {
            const {currentQuestion } = get()

            const prevQuestion = currentQuestion - 1

            if(prevQuestion >= 0) {
                set({currentQuestion: prevQuestion})
            }
        },
        reset: () => {
            set({currentQuestion: 0, questions: []})
        }
    }
}, {
    name: 'questions' // Nombre de lo que queremos persistir
})) 

// Se tipa como funcion, porque persist a su vez devuelve una funcion.