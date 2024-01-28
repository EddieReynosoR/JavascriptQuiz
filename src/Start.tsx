import { Button } from "@mui/material";
import { useQuestionsStore } from "./store/questions";

const QUESTIONS_LIMIT = 10

export function Start(){
    const fetchQuestions = useQuestionsStore(state => state.fetchQuestions)

    const handleClick = () => fetchQuestions(QUESTIONS_LIMIT)

    return <Button onClick={handleClick} variant="contained">¡Empezar!</Button>
}