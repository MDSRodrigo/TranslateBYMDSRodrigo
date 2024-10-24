// Defina o idioma alvo da tradução, por exemplo, 'en' para inglês
const targetLanguage = 'pt';

// Função para traduzir o texto
async function translateText(text) {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`);
    const result = await response.json();
    return result[0][0][0]; // Retorna o texto traduzido
}

// Função principal que traduz as mensagens no chat
function translateMessages(messages) {
    messages.forEach(async (message) => {
        const originalText = message.content;
        const translatedText = await translateText(originalText);

        // Substitua o texto da mensagem no DOM
        const messageElement = document.querySelector(`[data-message-id="${message.id}"]`);
        if (messageElement) {
            const messageContent = messageElement.querySelector('.messageContent');
            if (messageContent) {
                messageContent.innerText = `${originalText} (Translated: ${translatedText})`;
            }
        }
    });
}

// Listener para capturar novas mensagens no chat
function onNewMessage(event) {
    const newMessages = event.messages || [];
    translateMessages(newMessages);
}

// Hook para monitorar o recebimento de novas mensagens
function hookMessages() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const newMessages = Array.from(mutation.addedNodes).map((node) => node.__message__);
                if (newMessages.length > 0) {
                    translateMessages(newMessages);
                }
            }
        });
    });

    const chatContainer = document.querySelector('.chatContent');
    if (chatContainer) {
        observer.observe(chatContainer, { childList: true, subtree: true });
    }
}

// Inicializar o plugin quando o Vencord carregar
function initPlugin() {
    hookMessages();
}

// Registrar o plugin com Vencord
Vencord.plugins.register({
    name: "TranslatorBYMDSRodrigo",
    description: "Translate chat messages in real-time",
    author: "MDSRodrigo",
    init: initPlugin
});
