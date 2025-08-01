def create_fill_in_blank_exercise(word_obj, mode="english_to_vn"):
    if mode == "english_to_vn":
        return {
            "question": f"What is the Vietnamese meaning of '{word_obj.english}'?",
            "answer": word_obj.vietnamese
        }
    else:
        return {
            "question": f"What is the English word for '{word_obj.vietnamese}'?",
            "answer": word_obj.english
        }
