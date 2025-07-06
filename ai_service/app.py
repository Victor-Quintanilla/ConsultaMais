import os 
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
app = Flask(__name__)

#utilizar a chave da API
api_key = os.getenv("GEMINI_API_KEY")

print(f"DEBUG: GEMINI_API_KEY lida do .env: {'Sim' if api_key else 'Não'}, Valor (primeiros 5 chars): {api_key[:5] if api_key else 'N/A'}")

if not api_key:
    print("CRÍTICO: GEMINI_API_KEY não encontrada. Verifique seu arquivo .env.")
    # Se a chave não for encontrada, é melhor sair para evitar o erro do SDK
    # ou retornar um erro Flask aqui se preferir.
    # Por enquanto, vamos deixar o SDK lançar a exceção se a configure falhar.

# Configurar a API do Gemini
# Passando a chave explicitamente
try:
    genai.configure(api_key=api_key)
    print("DEBUG: genai.configure executado com sucesso.")
except Exception as e:
    print(f"ERRO: genai.configure falhou: {e}")
    # Se falhar aqui, o problema é grave com a chave ou SDK.
    # Você não quer que o servidor inicie sem a chave.
    exit(1)


#iniciar modelo
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

def construir_prompt_relatorio(event_title, feedbacks_data):
    prompt = f"""
Você é um analista de dados experiente e especialista em feedback de eventos corporativos. Sua tarefa é analisar uma coleção de feedbacks de participantes para o evento '{event_title}'.

Crie um relatório de análise de feedback profissional e abrangente, focado em insights acionáveis para a equipe de Recursos Humanos e os organizadores do evento.

O relatório deve conter as seguintes seções bem definidas:

---

### **Relatório de Análise de Feedback do Evento: '{event_title}'**

#### **1. Resumo Executivo**
    - Uma breve visão geral dos principais pontos positivos e áreas de melhoria, destacando o sentimento geral do evento.

#### **2. Análise de Pontos Fortes (Atrativos mais Comentados)**
    - Identifique e detalhe os aspectos mais elogiados e bem-sucedidos do evento, baseando-se nos comentários de sentimento 'positivo' e 'neutro'.
    - Mencione temas recorrentes, atividades específicas, palestrantes, organização, local, ou qualquer outro elemento que tenha sido consistentemente positivo.
    - Inclua exemplos de frases-chave dos feedbacks para ilustrar os pontos.

#### **3. Análise de Pontos a Melhorar (Críticas e Sugestões)**
    - Identifique e detalhe as principais áreas que receberam críticas ou sugestões de melhoria, baseando-se nos comentários de sentimento 'negativo' e 'neutro'.
    - Mencione temas recorrentes como problemas de logística, conteúdo, duração, comunicação, ou qualquer outro ponto de insatisfação.
    - Inclua exemplos de frases-chave dos feedbacks para ilustrar as áreas problemáticas.

#### **4. Insights Gerais e Informações Úteis**
    - Extraia qualquer informação adicional relevante dos feedbacks que possa ser útil para futuros eventos, mesmo que não se encaixe diretamente em "pontos fortes" ou "pontos a melhorar".
    - Isso pode incluir sugestões inesperadas, observações sobre o perfil dos participantes, necessidades não atendidas, ou oportunidades de engajamento.

#### **5. Recomendação de Ações Futuras**
    - Com base na análise, forneça 2-3 recomendações concretas e acionáveis para aprimorar a experiência em eventos futuros ou para otimizar os processos de RH.

---

**Dados de Feedback para Análise:**

Abaixo estão os feedbacks dos participantes, cada um com seu respectivo participante, sentimento e comentário:

"""

    for fb in feedbacks_data:
        participante = fb.get('participante', 'Anônimo')
        comentario = fb.get('comentario', 'N/A')
        sentimento = fb.get('sentimento', 'N/A')
        prompt += f"- **Participante:** {participante}\n"
        prompt += f"  **Sentimento:** {sentimento}\n"
        prompt += f"  **Comentário:** \"{comentario}\"\n\n"

    prompt += """
Por favor, gere o relatório completo e formatado conforme as seções acima.
"""
    return prompt

@app.route('/generate-report', methods=['POST'])
def generate_report():
    data = request.json
    feedbacks = data.get('feedbacks', [])
    event_title = data.get('event_title', 'Evento Desconhecido')

    if not feedbacks:
        return jsonify({"error": "Sem feedbacks."}), 400
    
    full_prompt = construir_prompt_relatorio(event_title, feedbacks)

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