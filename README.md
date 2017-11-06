# ProjetoPG
Projeto1PG

Primeiro projeto de PG de 2017.2
Tema 2.3

2.3 Interpolação de B-splines Cúbico C1 Interativo

O usuário com as parametrizações com slide buttons. O usuário também escolhe o método de cálculo das tangentes (entre dois: FMILL e Bessel). O sistema calcula os pontos de controle de Bézier e desenha a curva correspondente de B-splines, interpolando os pontos dados em tempo real (qualquer modificação do usuário implica em imediata resposta do sistema). O sistema deve permitir que a curva seja fechada, à escolha do usuário.


Explicação da Interface:
A medida que o usuário vai criando arbitrariamente os pontos, cria-se um novo slide button, pelo qual o usuário dirá o tamanho do intervalo entre aquele u e o passado. O valor de cada slide button pode ser alterado, mudando interativamente os valores dos us.

Há um toggle button clareado, que apenas fica disponível quando o usuário marca a checkbox "Desejo que a curva seja fechada!", pois em caso dela ser aberta, FMILL não pode ser usado para calcular as tangentes pois não consegue calcular a primeira e a última, apenas Bessel.

Pode-se ainda ocultar os pontos de controle, a poligonal de controle e a curva de Bezier, selecionando os checkboxes. 


