import os 
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
app = Flask(__name__)

#utilizar a chave da API
genai.configure(api_key=os.getenv("chave"))

#iniciar modelo
model = genai.GenerativeModel('gemini-pro')

@app.route('/generate-report', methods=['POST'])
def generate_report():
    data = request.json
    feedbacks = data.get('feedbacks', [])

    if not feedbacks:
        return jsonify({"error": "Sem feedbacks."}), 400
    
    #criar um prompt
    prompt_parts = [
        "Você é um analista de feedback de eventos corporativos. Com base nos seguintes comentários e sentimentos, gere um relatório conciso que inclua:\n",
        "1. Pontos fortes (atrativos mais comentados).\n",
        "2. Pontos a melhorar (críticas e sugestões).\n",
        "3. Informações úteis ou insights gerais.\n",
        "Aqui estão os feedbacks:\n"
    ]

    for fb in feedbacks:
        prompt_parts.append(f"- Participante: {fb.get('participante', 'Anonimo')}, Sentimento: {fb.get('sentimento', 'N/A')}, Comentário: \"{fb.get('comentario', 'N/A')}\"\n")

    #juntar o prompt
    full_prompt = "".join(prompt_parts)

    try:
        #chamar API gemini
        response = model.generate_content(full_prompt)
        report_content = response.text # resposta

        return jsonify({"report": report_content}), 200

    except Exception as e:
        print(f"Erro ao chamar a API do Gemini: {e}")
        return jsonify({"error": "Falha em gerar resposta."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)