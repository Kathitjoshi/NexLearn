package ooadproject.ooadproject.models;

public class Answer {
    private String questionText;
    private String selectedAnswer;
    private boolean correct;

    public Answer() {}

    public String getQuestionText() { return questionText; }
    public String getSelectedAnswer() { return selectedAnswer; }
    public boolean isCorrect() { return correct; }

    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }
    public void setCorrect(boolean correct) { this.correct = correct; }
}
