const section3Questions = {
  options: [
    {id: 7, label: 'Como avalia a comunicação geral do escritório?'},
    {id: 8, label: 'Como avalia a transparência em relação a prazos e honorários?'},
    {id: 9, label: 'Como avalia a facilidade para falar com um sócio ou gestor, quando necessário? '},
    {id: 10, label: 'Em uma escala de 0 a 10, como você avalia o custo-benefício dos serviços prestados pelo escritório?'},
  ],
  title: 'Avaliação do escritório',
};

const section4SubAQuestions = {
  options: [
    {id: 12, label: 'Facilidade para contatar a equipe da área'},
    {id: 13, label: 'Agilidade no retorno inicial'},
  ],
  title: 'Atendimento e acesso',
};

const section4SubBQuestions = {
  options: [
    {id: 14, label: 'Clareza nas explicações técnicas'},
    {id: 15, label: 'Disponibilidade para tirar dúvidas'},
    {id: 16, label: 'Transparência sobre riscos e oportunidades'},
  ],
  title: 'Comunicação e relacionamento',
};

const section4SubCQuestions = {
  options: [
    {id: 17, label: 'Conhecimento técnico da equipe'},
    {id: 18, label: 'Cumprimento de prazos'},
    {id: 19, label: 'Eficácia na solução apresentada'},
  ],
  title: 'Qualidade técnica e execução',
};

const section4SubDQuestions = {
  options: [
    {id: 20, label: 'Sensação de que seu caso recebeu atenção dedicada'},
    {id: 21, label: 'Empatia e compreensão da sua situação'},
  ],
  title: 'Atendimento personalizado',
};

export function getSection3Questions() {
  return section3Questions;
}

export function getSection4Questions() {
  return {
    subs: [
      section4SubAQuestions,
      section4SubBQuestions,
      section4SubCQuestions,
      section4SubDQuestions,
    ],
    title: 'Avaliação da área',
  }
}
