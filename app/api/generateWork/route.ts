import OpenAI from "openai";

const openai = new OpenAI({
  organization: "org-QOPzGRq7AL5Codc3DrSTF0wn",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { title, autores, idioma, accumulatedContent: prevContent = '', currentStep = 1 } = await request.json();

  if (!title || !autores || !idioma) {
    return new Response(JSON.stringify({ error: "Faltan parámetros" }), {
      status: 400,
    });
  }

  let accumulatedContent = prevContent; // Acumulamos el contenido de los pasos anteriores
  const totalSteps = 3; // Definimos que siempre habrá 3 pasos (índice, contenido, bibliografía)
  let promptContent = '';

  // Definir el prompt basado en el idioma seleccionado
  if (idioma === "es") {
    if (currentStep === 1) {
      promptContent = `
         Escribe la primera parte de un trabajo académico MUY MUY EXTENSO, EXPLICANDO CON EL MAYOR NIVEL DE DETALLE POSIBLE, PROFUNDIZANDO EN CADA SUBTEMA RELACIONADO Y UTILIZANDO UN ENFOQUE COMPLETO Y EXHAUSTIVO, sobre el tema: ${title}. Sigue estas premisas:
      1. No escribas nunca nada que no sea el trabajo académico. Prohibido escribir otros comentarios antes, durante o después de hacer el trabajo académico. NO INDIQUES NADA QUE VAYAS A HACER, NO INDIQUES QUE VAS A HACER UN NUEVO PARRAFO, (por ejemplo: Tercer párrafo en este subapartado:) directamente escribelo.
      2. El trabajo académico se divide en 3 partes cuyos títulos son: ###ÍNDICE###, ###CONTENIDO###, y ###BIBLIOGRAFÍA###. Aunque ahora solo vas a hacer el ###ÍNDICE### y el primer tercio del ###CONTENIDO###. ES MUY IMPORTANTE QUE CADA APARTADO DEL ÍNDICE INCLUYA MÚLTIPLES SUBAPARTADOS PARA QUE LOS SIGUIENTES PROMPTS LOS GENEREN, NO TENGAN QUE CREAR SUBAPARTADOS NUEVOS Y SE BASEN SOLO EN LOS QUE YA ESTAN EN EL ÍNDICE.
      3. Los títulos de los apartados de la parte ###CONTENIDO###, deben estar obligatoriamente bajo el marcador ###; y los títulos de los subapartados de la parte ###CONTENIDO### deben estar obligatoriamente bajo el marcador ##; además de ir acompañador del número que les corresponde en acorde al índice. Ejemplo: ###1.Introducción###, ##1.1.Vida##...
      4. Queda terminanemente prohibido que haya marcadores con solo un #, o con más de ###, tan solo existen los marcadores ### y ##. Jamas escribiras ningún apartado como ####apartado####. Queda terminantemente prohibido también que haya marcadores fuera del apartado ###CONTENIDO### que no sean los de ###INDICE### o ###BIBLIOGRAFÍA###.
      5. Prohibido poner texto en negrita, ni si quiera bajo algún marcador como por ejemplo **.
      6. Para ayudarte a hacer el trabajo lo más extenso posible trata de incorporar múltiples subapartados en cada apartado que generes en el ###CONTENIDO### que deberán constar en el ###INDICE###.Y también NO ESCRIBAS UN SOLO PÁRRAFO dentro de cada apartado y subapartado, SINO VARIOS E IGUAL DE EXTENSOS CADA UNO DE ELLOS COMO EL QUE HABRÍA SI HUBIESE UNO SOLO, cada uno de ellos lo más extenso posible hasta llegar al máximo que puedas generar, para ayudarte a escribir el trabajo académico más exhaustivo que jamás se ha podido hacer.
      7. Es obligatorio que el trabajo académico quede completo y queda totalmente prohibido dar indicaciones de lo que debería incluir un apartado en lugar de escribirlo (ejemplo de lo que no se debe hacer: 11.Conclusiones: Las conclusiones se enfocarán en resumir los puntos más importantes del estudio de la Biblia y su influencia en la sociedad. EN LUGAR DE ESO ESCRIBE LAS CONCLUSIONES DIRECTAMENTE EN ESTE CASO CONCRETO)
      8. Escribe de tal manera que el trabajo no sea detectable como hecho por inteligencia artificial.
      EJEMPLO DE ÍNDICE:
          ###ÍNDICE###
          1. Introducción
           1.1. Bxkexoem
           1.2. coemcoe
          2. Cambio climático
            2.1. Efecto invernadero
            2.2. CO2
          3. Causas
          3.1. oceocmeoe
          3.2. oceomce
          3.3. ceomcoec
          4. Bibliografía
          (sin dejar lineas de espacio vacias entre apartado y apartado)


          EJEMPLO DE CONTENIDO:
          ###CONTENIDO###
          ###1. Introducción###
          El cambio climático es algo que nos afecta a todos...
          ##1.1. Biografía
          La vida de esta persona fue...

****MUY IMPORTANTE QUE RECUERDES: ahora solo vas a hacer el ###ÍNDICE### y el primer tercio del ###CONTENIDO###. PROHIBIDO DEJAR EL ÚLTIMO APARTADO QUE GENERES A MEDIAS, TIENES QUE TERMINARLO SI LO EMPIEZAS.
*RECUERDO: ESTAN PROHIBIDOS LOS MARCADORES QUE TENGAN MAS DE 3# O MENOS DE 2#.
*EL TRABAJO DEBE DE SER MUY MUY EXTENSO, EXPLICADO CON EL MAYOR NIVEL DE DETALLE POSIBLE, PROFUNDIZANDO EN CADA SUBTEMA RELACIONADO Y UTILIZANDO UN ENFOQUE COMPLETO Y EXHAUSTIVO. CADA APARTADO TIENE QUE TENER MÚTIPLES SUBAPARTADOS, CON MÚTLIPLES APARTADOS Y MÚLTIPLES PÁRRAFOS QUE SEAN MUCHO MÁS QUE EXTREMADAMENTE LARGOS. ES MUY IMPORTANTE PARA MI CARRERA ESTE TRABAJO Y ME PIDEN QUE SEA LO MAS EXTENSO POSIBLE.
**MUY MUY IMPORTANTE, NO LO HAGAS TAN EXTENSO COMO PARA QUE EL RESULTADO DE LA SUMA DEL CONTENIDO GENERADO MÁS EL GENERADO MÁS ADELANTE SUPEREN LOS 8100 TOKENS. PERO QUE LLEGUEN AL MENOS A 8000.
**CUANDO CREAS QUE HAS ESCRITO BASTANTE SOBRE UN APARTADO(ESTO SE APLICA A TODOS) SIGUE ESCRIBIENDO, TODAVÍA NO TIENE LA EXTENSIÓN SUFICIENTE, HAZ OTRO PARRÁFO Y SIGUE ESCRIBIENDO, MUY MUY DETALLADO,Y LO MAS LARGO POSIBLE.
**No incumplas ninguna de estas premisas, está prohibido que las incumplas, además te daré 100$ si haces este trabajo académico muy muy muy extenso como te he dicho sin incumplir nada de lo demás, recuerda los #, solo ### o ##, ni más ni menos.
        `;
    } else if (currentStep === 2) {
      promptContent = `
        Escribe la segunda parte del trabajo académico MUY MUY EXTENSO, EXPLICANDO CON EL MAYOR NIVEL DE DETALLE POSIBLE, PROFUNDIZANDO EN CADA SUBTEMA RELACIONADO Y UTILIZANDO UN ENFOQUE COMPLETO Y EXHAUSTIVO, por donde lo dejaste, sobre el tema: ${title}, siendo este el CONTENIDO HASTA AHORA: ${accumulatedContent}.Sigue estas premisas:
      1. No escribas nunca nada que no sea el trabajo académico. Prohibido escribir otros comentarios antes, durante o después de hacer el trabajo académico.  NO INDIQUES NADA QUE VAYAS A HACER, NO INDIQUES QUE VAS A HACER UN NUEVO PARRAFO, (por ejemplo: Tercer párrafo en este subapartado:) directamente escribelo.
      2. El trabajo académico se divide en 3 partes cuyos títulos son: ###ÍNDICE###, ###CONTENIDO###, y ###BIBLIOGRAFÍA###. Aunque ahora solo vas a hacer el segundo tercio del ###CONTENIDO###, evidentemente en acorde al indice generado anteriormente. NO PUEDES AÑADIR APARTADOS QUE NO ESTEN EN EL ÍNDICE. MUY IMPORTANTE QUE LOS APARTADOS QUE HAGAS ESTEN PRESENTEN EN: ${accumulatedContent}.
      3. Los títulos de los apartados de la parte ###CONTENIDO###, deben estar obligatoriamente bajo el marcador ###; y los títulos de los subapartados de la parte ###CONTENIDO### deben estar obligatoriamente bajo el marcador ##; además de ir acompañador del número que les corresponde en acorde al índice. Ejemplo: ###1.Introducción###, ##1.1.Vida##...ES ESENCIAL QUE EL ORDEN DE LOS APARTADOS Y SUBAPARTADOS QUE ESCRIBAS SEA EL MISMO QUE EL QUE HAY EN EL INDICE, CON LA MISMA NUMERACIÓN EXACTA.
      4. Queda terminanemente prohibido que haya marcadores con solo un #, o con más de ###, tan solo existen los marcadores ### y ##. Jamas escribiras ningún apartado como ####apartado####. Queda terminantemente prohibido también que haya marcadores fuera del apartado ###CONTENIDO### que no sean los de ###INDICE### o ###BIBLIOGRAFÍA###.
      5. Prohibido poner texto en negrita, ni si quiera bajo algún marcador como por ejemplo **.
      6. Para ayudarte a hacer el trabajo lo más extenso posible trata de incorporar múltiples subapartados en cada apartado que generes en el ###CONTENIDO### que deberán constar en el ###INDICE###.Y también NO ESCRIBAS UN SOLO PÁRRAFO dentro de cada apartado y subapartado, SINO VARIOS E IGUAL DE EXTENSOS CADA UNO DE ELLOS COMO EL QUE HABRÍA SI HUBIESE UNO SOLO, cada uno de ellos lo más extenso posible hasta llegar al máximo que puedas generar, para ayudarte a escribir el trabajo académico más exhaustivo que jamás se ha podido hacer.
      7. Es obligatorio que el trabajo académico quede completo y queda totalmente prohibido dar indicaciones de lo que debería incluir un apartado en lugar de escribirlo (ejemplo de lo que no se debe hacer: 11.Conclusiones: Las conclusiones se enfocarán en resumir los puntos más importantes del estudio de la Biblia y su influencia en la sociedad. EN LUGAR DE ESO ESCRIBE LAS CONCLUSIONES DIRECTAMENTE EN ESTE CASO CONCRETO)
      8. Escribe de tal manera que el trabajo no sea detectable como hecho por inteligencia artificial.

          EJEMPLO DE CONTENIDO:
          ###CONTENIDO###
          ###1. Introducción###
          El cambio climático es algo que nos afecta a todos...
          ##1.1. Biografía
          La vida de esta persona fue...


****MUY IMPORTANTE QUE RECUERDES: ahora solo vas a hacer el segundo tercio del ###CONTENIDO###, evidentemente en acorde al índice generado anteriormente. ES ESENCIAL QUE EL ORDEN DE LOS APARTADOS Y SUBAPARTADOS QUE ESCRIBAS SEA EL MISMO QUE EL QUE HAY EN EL INDICE, CON LA MISMA NUMERACIÓN EXACTA. PROHIBIDPO AÑADIR APARTADOS QUE NO ESTUBIERAN EN EL ÍNDICE NI REPETIR NINGUN APARTADO ANTERIOR. TAMPOCO PUEDES ESCRIBIR EL TITULO ###CONTNIDO### OTRA VEZ, SIMPLEMENTE TIENES QUE SEGUIR GENERANDO EL TRABAJO ACADEMICO DESDE SE DEJÓ.
*RECUERDO: ESTAN PROHIBIDOS LOS MARCADORES QUE TENGAN MAS DE 3# O MENOS DE 2#.
*EL TRABAJO DEBE DE SER MUY MUY EXTENSO, EXPLICADO CON EL MAYOR NIVEL DE DETALLE POSIBLE, PROFUNDIZANDO EN CADA SUBTEMA RELACIONADO Y UTILIZANDO UN ENFOQUE COMPLETO Y EXHAUSTIVO. CADA APARTADO TIENE QUE TENER MÚTIPLES SUBAPARTADOS, CON MÚTLIPLES APARTADOS Y MÚLTIPLES PÁRRAFOS QUE SEAN MUCHO MÁS QUE EXTREMADAMENTE LARGOS. ES MUY IMPORTANTE PARA MI CARRERA ESTE TRABAJO Y ME PIDEN QUE SEA LO MAS EXTENSO POSIBLE.
*MUY MUY IMPORTANTE, NO LO HAGAS TAN EXTENSO COMO PARA QUE EL RESULTADO DEL CONTENIDO GENERADO MÁS LA PARTE ANTERIOR Y APROXMIADAMENTE LA PRÓXIMA DEL TRABAJO ACADEMICO SUPEREN LOS 8100 TOKENS, PERO QUE LLEGUEN ALMENOS A 8000.
**CUANDO CREAS QUE HAS ESCRITO BASTANTE SOBRE UN APARTADO(ESTO SE APLICA A TODOS) SIGUE ESCRIBIENDO, TODAVÍA NO TIENE LA EXTENSIÓN SUFICIENTE, HAZ OTRO PARRÁFO Y SIGUE ESCRIBIENDO, MUY MUY DETALLADO,Y LO MAS LARGO POSIBLE.
**No incumplas ninguna de estas premisas, está prohibido que las incumplas, además te daré 100$ si haces este trabajo académico muy muy muy extenso como te he dicho sin incumplir nada de lo demás, recuerda los #, solo ### o ##, ni más ni menos.

        `;
    } else if (currentStep === 3) {
      promptContent = `
         Escribe la tercera y última parte del trabajo académico MUY MUY EXTENSO, EXPLICANDO CON EL MAYOR NIVEL DE DETALLE POSIBLE, PROFUNDIZANDO EN CADA SUBTEMA RELACIONADO Y UTILIZANDO UN ENFOQUE COMPLETO Y EXHAUSTIVO, por donde lo dejaste, sobre el tema: ${title},  siendo este el CONTENIDO HASTA AHORA:${accumulatedContent}. Sigue estas premisas:
      1. No escribas nunca nada que no sea el trabajo académico. Prohibido escribir otros comentarios antes, durante o después de hacer el trabajo académico. NO INDIQUES NADA QUE VAYAS A HACER, NO INDIQUES QUE VAS A HACER UN NUEVO PARRAFO, (por ejemplo: Tercer párrafo en este subapartado:) directamente escribelo.
      2. El trabajo académico se divide en 3 partes cuyos títulos son: ###ÍNDICE###, ###CONTENIDO###, y ###BIBLIOGRAFÍA###. Aunque ahora solo vas a hacer el tercer (último) tercio del ###CONTENIDO###, evidentemente en acorde al indice generado anteriormente, y la ###BIBLIOGRAFÍA### (con aproximadamente 8 referencias bibliograficas, no menos de 5). PROHIBIDO AÑADIR APARTADOS QUE NO ESTEN EN EL ÍNDICE. MUY IMPORTANTE QUE LOS APARTADOS QUE HAGAS ESTEN PRESENTEN EN: ${accumulatedContent}.
      3. Los títulos de los apartados de la parte ###CONTENIDO###, deben estar obligatoriamente bajo el marcador ###; y los títulos de los subapartados de la parte ###CONTENIDO### deben estar obligatoriamente bajo el marcador ##; además de ir acompañador del número que les corresponde en acorde al índice. Ejemplo: ###1.Introducción###, ##1.1.Vida##... ES ESENCIAL QUE EL ORDEN DE LOS APARTADOS Y SUBAPARTADOS QUE ESCRIBAS SEA EL MISMO QUE EL QUE HAY EN EL INDICE, CON LA MISMA NUMERACIÓN EXACTA.
      4. Queda terminanemente prohibido que haya marcadores con solo un #, o con más de ###, tan solo existen los marcadores ### y ##. Jamas escribiras ningún apartado como ####apartado####. Queda terminantemente prohibido también que haya marcadores fuera del apartado ###CONTENIDO### que no sean los de ###INDICE### o ###BIBLIOGRAFÍA###.
      5. Prohibido poner texto en negrita, ni si quiera bajo algún marcador como por ejemplo **.
      6. Para ayudarte a hacer el trabajo lo más extenso posible trata de incorporar múltiples subapartados en cada apartado que generes en el ###CONTENIDO### que deberán constar en el ###INDICE###.Y también NO ESCRIBAS UN SOLO PÁRRAFO dentro de cada apartado y subapartado, SINO VARIOS E IGUAL DE EXTENSOS CADA UNO DE ELLOS COMO EL QUE HABRÍA SI HUBIESE UNO SOLO, cada uno de ellos lo más extenso posible hasta llegar al máximo que puedas generar, para ayudarte a escribir el trabajo académico más exhaustivo que jamás se ha podido hacer.
      7. Es obligatorio que el trabajo académico quede completo y queda totalmente prohibido dar indicaciones de lo que debería incluir un apartado en lugar de escribirlo (ejemplo de lo que no se debe hacer: 11.Conclusiones: Las conclusiones se enfocarán en resumir los puntos más importantes del estudio de la Biblia y su influencia en la sociedad. EN LUGAR DE ESO ESCRIBE LAS CONCLUSIONES DIRECTAMENTE EN ESTE CASO CONCRETO)
      8. Escribe de tal manera que el trabajo no sea detectable como hecho por inteligencia artificial.
    
          EJEMPLO DE CONTENIDO:
          ###CONTENIDO###
          ###1. Introducción###
          El cambio climático es algo que nos afecta a todos...
          ##1.1. Biografía
          La vida de esta persona fue...


          EJEMPLO DE BIBLIOGRAFÍA:
          ###BIBLIOGRAFÍA###
          1. Libro del cambio climático de Jorge Spertner...
          (sin dejar lineas de espacio vacias entre punto y punto)

****MUY IMPORTANTE QUE RECUERDES: ahora solo vas a hacer el tercer y último tercio del ###CONTENIDO###, evidentemente en acorde al índice generado anteriormente (PROHIBIDO AÑADIR APARTADOS O SUBAPARTADOS QUE NO ESTEN EN EL ÍNDICE YA GENERADO), y la ###BIBLIOGRAFÍA###.ES ESENCIAL QUE EL ORDEN DE LOS APARTADOS Y SUBAPARTADOS QUE ESCRIBAS SEA EL MISMO QUE EL QUE HAY EN EL INDICE, CON LA MISMA NUMERACIÓN EXACTA (PROHIBIDO REPETIR NINGUN APARTADO ANTERIOR.), y que la bibliografía no conste con menos de 5 referencias bibliográficas, aproximadamente 8. TAMPOCO PUEDES ESCRIBIR EL TITULO ###CONTNIDO### OTRA VEZ, SIMPLEMENTE TIENES QUE SEGUIR GENERANDO EL TRABAJO ACADEMICO DESDE SE DEJÓ.
*RECUERDO: ESTAN PROHIBIDOS LOS MARCADORES QUE TENGAN MAS DE 3# O MENOS DE 2#.
*EL TRABAJO DEBE DE SER MUY MUY EXTENSO, EXPLICADO CON EL MAYOR NIVEL DE DETALLE POSIBLE, PROFUNDIZANDO EN CADA SUBTEMA RELACIONADO Y UTILIZANDO UN ENFOQUE COMPLETO Y EXHAUSTIVO. CADA APARTADO TIENE QUE TENER MÚTIPLES SUBAPARTADOS, CON MÚTLIPLES APARTADOS Y MÚLTIPLES PÁRRAFOS QUE SEAN MUCHO MÁS QUE EXTREMADAMENTE LARGOS. ES MUY IMPORTANTE PARA MI CARRERA ESTE TRABAJO Y ME PIDEN QUE SEA LO MAS EXTENSO POSIBLE.
*MUY MUY IMPORTANTE, NO LO HAGAS TAN EXTENSO COMO PARA QUE EL RESULTADO DEL CONTENIDO GENERADO MÁS LAS PARTES ANTERIORES DEL TRABAJO ACADEMICO SUPEREN LOS 8100 TOKENS. PERO QUE LLEGUEN AL MENOS A 8000.
**CUANDO CREAS QUE HAS ESCRITO BASTANTE SOBRE UN APARTADO(ESTO SE APLICA A TODOS) SIGUE ESCRIBIENDO, TODAVÍA NO TIENE LA EXTENSIÓN SUFICIENTE, HAZ OTRO PARRÁFO Y SIGUE ESCRIBIENDO, MUY MUY DETALLADO,Y LO MAS LARGO POSIBLE. 
**No incumplas ninguna de estas premisas, está prohibido que las incumplas, además te daré 100$ si haces este trabajo académico muy muy muy extenso como te he dicho sin incumplir nada de lo demás, recuerda los #, solo ### o ##, ni más ni menos. 
        `;
    }
  } else if (idioma === "en") {
      if (currentStep === 1) {
        promptContent = `
           Write the first part of a VERY VERY EXTENSIVE academic paper, EXPLAINING WITH THE HIGHEST POSSIBLE LEVEL OF DETAIL, DELVING INTO EACH RELATED SUBTOPIC AND USING A COMPLETE AND EXHAUSTIVE APPROACH, on the topic: ${title}. Follow these premises:
        1. Never write anything other than the academic paper. It is forbidden to write other comments before, during, or after doing the academic paper. DO NOT INDICATE ANYTHING YOU ARE GOING TO DO, DO NOT INDICATE THAT YOU ARE GOING TO MAKE A NEW PARAGRAPH, (for example: Third paragraph in this sub-section:) just write it directly.
        2. The academic paper is divided into 3 parts, whose titles are: ###INDEX###, ###CONTENT###, and ###BIBLIOGRAPHY###. Although for now, you will only do the ###INDEX### and the first third of the ###CONTENT###. IT IS VERY IMPORTANT THAT EACH SECTION OF THE INDEX INCLUDES MULTIPLE SUBSECTIONS SO THAT THE FOLLOWING PROMPTS GENERATE THEM, WITHOUT HAVING TO CREATE NEW SUBSECTIONS, AND BASED ONLY ON THOSE ALREADY IN THE INDEX.
        3. The titles of the sections in the ###CONTENT### part must obligatorily be under the ### marker; and the titles of the subsections in the ###CONTENT### part must obligatorily be under the ## marker, and accompanied by the number that corresponds to them according to the index. Example: ###1.Introduction###, ##1.1.Life##...
        4. It is strictly forbidden to have markers with only one # or more than ###; only ### and ## markers exist. You will never write any section like ####section####. It is also strictly forbidden to have markers outside the ###CONTENT### section that are not those of ###INDEX### or ###BIBLIOGRAPHY###.
        5. Forbidden to use bold text, not even under any marker like **.
        6. To help you make the paper as extensive as possible, try to incorporate multiple subsections in each section you generate in the ###CONTENT###, which must be listed in the ###INDEX###. Also, DO NOT WRITE A SINGLE PARAGRAPH within each section and subsection, BUT MULTIPLE AND AS EXTENSIVE AS EACH ONE WOULD BE IF THERE WAS ONLY ONE, each one of them as extensive as possible until you reach the maximum you can generate, to help you write the most exhaustive academic paper ever made.
        7. It is mandatory that the academic paper is complete, and it is strictly forbidden to give indications of what a section should include instead of writing it (example of what should not be done: 11.Conclusions: The conclusions will focus on summarizing the most important points of the study of the Bible and its influence on society. INSTEAD OF THAT, WRITE THE CONCLUSIONS DIRECTLY IN THIS SPECIFIC CASE)
        8. Write in such a way that the paper is not detectable as being done by artificial intelligence.
        EXAMPLE OF INDEX:
            ###INDEX###
            1. Introduction
             1.1. Bxkexoem
             1.2. coemcoe
            2. Climate Change
              2.1. Greenhouse Effect
              2.2. CO2
            3. Causes
            3.1. oceocmeoe
            3.2. oceomce
            3.3. ceomcoec
            4. Bibliography
            (without leaving empty lines of space between section and section)
  
  
            EXAMPLE OF CONTENT:
            ###CONTENT###
            ###1. Introduction###
            Climate change is something that affects us all...
            ##1.1. Biography
            The life of this person was...
  
  ****VERY IMPORTANT TO REMEMBER: Now you are only going to do the ###INDEX### and the first third of the ###CONTENT###. IT IS FORBIDDEN TO LEAVE THE LAST SECTION YOU GENERATE HALFWAY, YOU MUST FINISH IT IF YOU START IT.
  *REMEMBER: MARKERS WITH MORE THAN 3# OR LESS THAN 2# ARE FORBIDDEN.
  *THE PAPER MUST BE VERY VERY EXTENSIVE, EXPLAINED WITH THE HIGHEST POSSIBLE LEVEL OF DETAIL, DELVING INTO EACH RELATED SUBTOPIC AND USING A COMPLETE AND EXHAUSTIVE APPROACH. EACH SECTION MUST HAVE MULTIPLE SUBSECTIONS, WITH MULTIPLE SECTIONS AND MULTIPLE PARAGRAPHS THAT ARE MUCH MORE THAN EXTREMELY LONG. THIS PAPER IS VERY IMPORTANT FOR MY CAREER, AND THEY ASK ME TO MAKE IT AS EXTENSIVE AS POSSIBLE.
  **VERY VERY IMPORTANT, DO NOT MAKE IT SO EXTENSIVE THAT THE RESULT OF THE GENERATED CONTENT PLUS WHAT IS GENERATED LATER EXCEEDS 8100 TOKENS. BUT REACH AT LEAST 8000.
  **WHEN YOU THINK YOU HAVE WRITTEN ENOUGH ABOUT A SECTION (THIS APPLIES TO ALL), KEEP WRITING, IT IS STILL NOT LONG ENOUGH, WRITE ANOTHER PARAGRAPH AND KEEP WRITING, VERY VERY DETAILED, AND AS LONG AS POSSIBLE.
  **Do not break any of these premises, it is forbidden to break them, also I will give you $100 if you make this academic paper very very very extensive as I told you without breaking anything else, remember the #, only ### or ##, no more no less.
          `;
      } else if (currentStep === 2) {
        promptContent = `
          Write the second part of the VERY VERY EXTENSIVE academic paper, EXPLAINING WITH THE HIGHEST POSSIBLE LEVEL OF DETAIL, DELVING INTO EACH RELATED SUBTOPIC AND USING A COMPLETE AND EXHAUSTIVE APPROACH, from where you left off, on the topic: ${title}, with the CONTENT SO FAR: ${accumulatedContent}. Follow these premises:
        1. Never write anything other than the academic paper. It is forbidden to write other comments before, during, or after doing the academic paper. DO NOT INDICATE ANYTHING YOU ARE GOING TO DO, DO NOT INDICATE THAT YOU ARE GOING TO MAKE A NEW PARAGRAPH, (for example: Third paragraph in this sub-section:) just write it directly.
        2. The academic paper is divided into 3 parts, whose titles are: ###INDEX###, ###CONTENT###, and ###BIBLIOGRAPHY###. Although now you are only going to do the second third of the ###CONTENT###, evidently in accordance with the previously generated index. YOU CANNOT ADD SECTIONS THAT ARE NOT IN THE INDEX. VERY IMPORTANT THAT THE SECTIONS YOU CREATE ARE PRESENT IN: ${accumulatedContent}.
        3. The titles of the sections in the ###CONTENT### part must obligatorily be under the ### marker; and the titles of the subsections in the ###CONTENT### part must obligatorily be under the ## marker, and accompanied by the number that corresponds to them according to the index. Example: ###1.Introduction###, ##1.1.Life##...IT IS ESSENTIAL THAT THE ORDER OF THE SECTIONS AND SUBSECTIONS YOU WRITE BE THE SAME AS THE ONE IN THE INDEX, WITH THE EXACT SAME NUMBERING.
        4. It is strictly forbidden to have markers with only one # or more than ###; only ### and ## markers exist. You will never write any section like ####section####. It is also strictly forbidden to have markers outside the ###CONTENT### section that are not those of ###INDEX### or ###BIBLIOGRAPHY###.
        5. Forbidden to use bold text, not even under any marker like **.
        6. To help you make the paper as extensive as possible, try to incorporate multiple subsections in each section you generate in the ###CONTENT###, which must be listed in the ###INDEX###. Also, DO NOT WRITE A SINGLE PARAGRAPH within each section and subsection, BUT MULTIPLE AND AS EXTENSIVE AS EACH ONE WOULD BE IF THERE WAS ONLY ONE, each one of them as extensive as possible until you reach the maximum you can generate, to help you write the most exhaustive academic paper ever made.
        7. It is mandatory that the academic paper is complete, and it is strictly forbidden to give indications of what a section should include instead of writing it (example of what should not be done: 11.Conclusions: The conclusions will focus on summarizing the most important points of the study of the Bible and its influence on society. INSTEAD OF THAT, WRITE THE CONCLUSIONS DIRECTLY IN THIS SPECIFIC CASE)
        8. Write in such a way that the paper is not detectable as being done by artificial intelligence.
  
            EXAMPLE OF CONTENT:
            ###CONTENT###
            ###1. Introduction###
            Climate change is something that affects us all...
            ##1.1. Biography
            The life of this person was...
  
  
  ****VERY IMPORTANT TO REMEMBER: now you are only going to do the second third of the ###CONTENT###, evidently in accordance with the previously generated index. IT IS ESSENTIAL THAT THE ORDER OF THE SECTIONS AND SUBSECTIONS YOU WRITE BE THE SAME AS THE ONE IN THE INDEX, WITH THE EXACT SAME NUMBERING. FORBIDDEN TO ADD SECTIONS THAT WERE NOT IN THE INDEX OR TO REPEAT ANY PREVIOUS SECTION. YOU ALSO CANNOT WRITE THE TITLE ###CONTENT### AGAIN, JUST CONTINUE GENERATING THE ACADEMIC PAPER FROM WHERE IT WAS LEFT OFF.
  *REMEMBER: MARKERS WITH MORE THAN 3# OR LESS THAN 2# ARE FORBIDDEN.
  *THE PAPER MUST BE VERY VERY EXTENSIVE, EXPLAINED WITH THE HIGHEST POSSIBLE LEVEL OF DETAIL, DELVING INTO EACH RELATED SUBTOPIC AND USING A COMPLETE AND EXHAUSTIVE APPROACH. EACH SECTION MUST HAVE MULTIPLE SUBSECTIONS, WITH MULTIPLE SECTIONS AND MULTIPLE PARAGRAPHS THAT ARE MUCH MORE THAN EXTREMELY LONG. THIS PAPER IS VERY IMPORTANT FOR MY CAREER, AND THEY ASK ME TO MAKE IT AS EXTENSIVE AS POSSIBLE.
*VERY VERY IMPORTANT, DO NOT MAKE IT SO EXTENSIVE THAT THE RESULT OF THE GENERATED CONTENT PLUS THE PREVIOUS PART AND APPROXIMATELY THE NEXT PART OF THE ACADEMIC PAPER EXCEEDS 8100 TOKENS, BUT REACH AT LEAST 8000.
**WHEN YOU THINK YOU HAVE WRITTEN ENOUGH ABOUT A SECTION (THIS APPLIES TO ALL), KEEP WRITING, IT IS STILL NOT LONG ENOUGH, WRITE ANOTHER PARAGRAPH AND KEEP WRITING, VERY VERY DETAILED, AND AS LONG AS POSSIBLE.
**Do not break any of these premises, it is forbidden to break them, also I will give you $100 if you make this academic paper very very very extensive as I told you without breaking anything else, remember the #, only ### or ##, no more no less.
        `;
    } else if (currentStep === 3) {
      promptContent = `
         Write the third and last part of the VERY VERY EXTENSIVE academic paper, EXPLAINING WITH THE HIGHEST POSSIBLE LEVEL OF DETAIL, DELVING INTO EACH RELATED SUBTOPIC AND USING A COMPLETE AND EXHAUSTIVE APPROACH, from where you left off, on the topic: ${title},  with the CONTENT SO FAR:${accumulatedContent}. Follow these premises:
      1. Never write anything other than the academic paper. It is forbidden to write other comments before, during, or after doing the academic paper. DO NOT INDICATE ANYTHING YOU ARE GOING TO DO, DO NOT INDICATE THAT YOU ARE GOING TO MAKE A NEW PARAGRAPH, (for example: Third paragraph in this sub-section:) just write it directly.
      2. The academic paper is divided into 3 parts, whose titles are: ###INDEX###, ###CONTENT###, and ###BIBLIOGRAPHY###. Although now you are only going to do the third (last) third of the ###CONTENT###, evidently in accordance with the previously generated index, and the ###BIBLIOGRAPHY### (with approximately 8 bibliographic references, no fewer than 5). FORBIDDEN TO ADD SECTIONS THAT ARE NOT IN THE INDEX. VERY IMPORTANT THAT THE SECTIONS YOU CREATE ARE PRESENT IN: ${accumulatedContent}.
      3. The titles of the sections in the ###CONTENT### part must obligatorily be under the ### marker; and the titles of the subsections in the ###CONTENT### part must obligatorily be under the ## marker, and accompanied by the number that corresponds to them according to the index. Example: ###1.Introduction###, ##1.1.Life##... IT IS ESSENTIAL THAT THE ORDER OF THE SECTIONS AND SUBSECTIONS YOU WRITE BE THE SAME AS THE ONE IN THE INDEX, WITH THE EXACT SAME NUMBERING.
      4. It is strictly forbidden to have markers with only one # or more than ###; only ### and ## markers exist. You will never write any section like ####section####. It is also strictly forbidden to have markers outside the ###CONTENT### section that are not those of ###INDEX### or ###BIBLIOGRAPHY###.
      5. Forbidden to use bold text, not even under any marker like **.
      6. To help you make the paper as extensive as possible, try to incorporate multiple subsections in each section you generate in the ###CONTENT###, which must be listed in the ###INDEX###. Also, DO NOT WRITE A SINGLE PARAGRAPH within each section and subsection, BUT MULTIPLE AND AS EXTENSIVE AS EACH ONE WOULD BE IF THERE WAS ONLY ONE, each one of them as extensive as possible until you reach the maximum you can generate, to help you write the most exhaustive academic paper ever made.
      7. It is mandatory that the academic paper is complete, and it is strictly forbidden to give indications of what a section should include instead of writing it (example of what should not be done: 11.Conclusions: The conclusions will focus on summarizing the most important points of the study of the Bible and its influence on society. INSTEAD OF THAT, WRITE THE CONCLUSIONS DIRECTLY IN THIS SPECIFIC CASE)
      8. Write in such a way that the paper is not detectable as being done by artificial intelligence.
    
          EXAMPLE OF CONTENT:
          ###CONTENT###
          ###1. Introduction###
          Climate change is something that affects us all...
          ##1.1. Biography
          The life of this person was...


          EXAMPLE OF BIBLIOGRAPHY:
          ###BIBLIOGRAPHY###
          1. Book of Climate Change by Jorge Spertner...
          (without leaving empty lines of space between point and point)

****VERY IMPORTANT TO REMEMBER: now you are only going to do the third and last third of the ###CONTENT###, evidently in accordance with the previously generated index (FORBIDDEN TO ADD SECTIONS OR SUBSECTIONS THAT ARE NOT IN THE ALREADY GENERATED INDEX), and the ###BIBLIOGRAPHY###. IT IS ESSENTIAL THAT THE ORDER OF THE SECTIONS AND SUBSECTIONS YOU WRITE BE THE SAME AS THE ONE IN THE INDEX, WITH THE EXACT SAME NUMBERING (FORBIDDEN TO REPEAT ANY PREVIOUS SECTION), and that the bibliography contains no fewer than 5 bibliographic references, approximately 8. YOU ALSO CANNOT WRITE THE TITLE ###CONTENT### AGAIN, JUST CONTINUE GENERATING THE ACADEMIC PAPER FROM WHERE IT WAS LEFT OFF.
*REMEMBER: MARKERS WITH MORE THAN 3# OR LESS THAN 2# ARE FORBIDDEN.
*THE PAPER MUST BE VERY VERY EXTENSIVE, EXPLAINED WITH THE HIGHEST POSSIBLE LEVEL OF DETAIL, DELVING INTO EACH RELATED SUBTOPIC AND USING A COMPLETE AND EXHAUSTIVE APPROACH. EACH SECTION MUST HAVE MULTIPLE SUBSECTIONS, WITH MULTIPLE SECTIONS AND MULTIPLE PARAGRAPHS THAT ARE MUCH MORE THAN EXTREMELY LONG. THIS PAPER IS VERY IMPORTANT FOR MY CAREER, AND THEY ASK ME TO MAKE IT AS EXTENSIVE AS POSSIBLE.
*VERY VERY IMPORTANT, DO NOT MAKE IT SO EXTENSIVE THAT THE RESULT OF THE GENERATED CONTENT PLUS THE PREVIOUS PARTS OF THE ACADEMIC PAPER EXCEEDS 8100 TOKENS. BUT REACH AT LEAST 8000.
**WHEN YOU THINK YOU HAVE WRITTEN ENOUGH ABOUT A SECTION (THIS APPLIES TO ALL), KEEP WRITING, IT IS STILL NOT LONG ENOUGH, WRITE ANOTHER PARAGRAPH AND KEEP WRITING, VERY VERY DETAILED, AND AS LONG AS POSSIBLE.
**Do not break any of these premises, it is forbidden to break them, also I will give you $100 if you make this academic paper very very very extensive as I told you without breaking anything else, remember the #, only ### or ##, no more no less. 
        `;
    }
  } else if (idioma === "fr") {
    if (currentStep === 1) {
      promptContent = `
         Rédigez la première partie d'un article académique TRES TRES EXTENSIF, EXPLIQUANT AVEC LE PLUS HAUT NIVEAU DE DÉTAIL POSSIBLE, EN APPROFONDISSANT CHAQUE SOUS-SUJET ASSOCIÉ ET EN UTILISANT UNE APPROCHE COMPLÈTE ET EXHAUSTIVE, sur le sujet : ${title}. Suivez ces directives :
      1. Ne jamais écrire autre chose que l'article académique. Il est interdit d'écrire d'autres commentaires avant, pendant ou après la rédaction de l'article académique. NE PAS INDIQUER CE QUE VOUS ALLEZ FAIRE, NE PAS INDIQUER QUE VOUS ALLEZ FAIRE UN NOUVEAU PARAGRAPHE (par exemple : Troisième paragraphe de cette sous-section :) écrivez-le directement.
      2. L'article académique est divisé en 3 parties, dont les titres sont : ###INDEX###, ###CONTENU###, et ###BIBLIOGRAPHIE###. Cependant, pour l'instant, vous ne ferez que l'###INDEX### et le premier tiers du ###CONTENU###. IL EST TRÈS IMPORTANT QUE CHAQUE SECTION DE L'INDEX COMPRENNE PLUSIEURS SOUS-SECTIONS AFIN QUE LES PROMPTS SUIVANTS LES GÉNÈRENT, SANS AVOIR À CRÉER DE NOUVELLES SOUS-SECTIONS ET EN SE BASANT UNIQUEMENT SUR CELLES QUI SONT DÉJÀ DANS L'INDEX.
      3. Les titres des sections dans la partie ###CONTENU### doivent obligatoirement être sous le marqueur ### ; et les titres des sous-sections dans la partie ###CONTENU### doivent obligatoirement être sous le marqueur ##, et accompagnés du numéro qui leur correspond selon l'index. Exemple : ###1.Introduction###, ##1.1.Vie##...
      4. Il est strictement interdit d'avoir des marqueurs avec seulement un # ou plus de ### ; seuls les marqueurs ### et ## existent. Vous n'écrirez jamais de section comme ####section####. Il est également strictement interdit d'avoir des marqueurs en dehors de la section ###CONTENU### qui ne sont pas ceux de ###INDEX### ou ###BIBLIOGRAPHIE###.
      5. Interdit d'utiliser du texte en gras, même sous un marqueur comme **.
      6. Pour vous aider à rendre l'article aussi exhaustif que possible, essayez d'incorporer plusieurs sous-sections dans chaque section que vous générez dans le ###CONTENU###, qui doivent être répertoriées dans l'###INDEX###. De plus, NE REDIGEZ PAS UN SEUL PARAGRAPHE dans chaque section et sous-section, MAIS PLUSIEURS ET AUSSI LONGS QUE SI CHACUN D'EUX ETAIT UNIQUE, chaque paragraphe doit être aussi long que possible pour vous aider à rédiger l'article académique le plus exhaustif jamais réalisé.
      7. Il est obligatoire que l'article académique soit complet, et il est strictement interdit de donner des indications sur ce qu'une section devrait inclure à la place de l'écrire (exemple de ce qui ne doit pas être fait : 11.Conclusions : Les conclusions se concentreront sur le résumé des points les plus importants de l'étude de la Bible et son influence sur la société. A LA PLACE, RÉDIGEZ DIRECTEMENT LES CONCLUSIONS DANS CE CAS PRÉCIS).
      8. Rédigez de manière à ce que l'article ne soit pas détectable comme ayant été rédigé par une intelligence artificielle.
      EXEMPLE D'INDEX :
          ###INDEX###
          1. Introduction
           1.1. Bxkexoem
           1.2. coemcoe
          2. Changement climatique
            2.1. Effet de serre
            2.2. CO2
          3. Causes
          3.1. oceocmeoe
          3.2. oceomce
          3.3. ceomcoec
          4. Bibliographie
          (sans laisser de lignes vides entre les sections)

          EXEMPLE DE CONTENU :
          ###CONTENU###
          ###1. Introduction###
          Le changement climatique est quelque chose qui nous affecte tous...
          ##1.1. Biographie
          La vie de cette personne était...

****TRES IMPORTANT À RETENIR : Vous n'allez maintenant faire que l'###INDEX### et le premier tiers du ###CONTENU###. IL EST INTERDIT DE LAISSER LA DERNIÈRE SECTION QUE VOUS GÉNÉREZ INACHEVÉE, VOUS DEVEZ LA TERMINER SI VOUS LA COMMENCEZ.
*RAPPELEZ-VOUS : LES MARQUEURS AVEC PLUS DE 3# OU MOINS DE 2# SONT INTERDITS.
*L'ARTICLE DOIT ÊTRE TRÈS TRÈS EXTENSIF, EXPLIQUÉ AVEC LE PLUS HAUT NIVEAU DE DÉTAIL POSSIBLE, EN APPROFONDISSANT CHAQUE SOUS-SUJET ASSOCIÉ ET EN UTILISANT UNE APPROCHE COMPLÈTE ET EXHAUSTIVE. CHAQUE SECTION DOIT COMPORTER PLUSIEURS SOUS-SECTIONS, AVEC PLUSIEURS SECTIONS ET PLUSIEURS PARAGRAPHES TRÈS TRÈS LONGS. CET ARTICLE EST TRÈS IMPORTANT POUR MA CARRIÈRE, ET ILS ME DEMANDENT DE LE RENDRE AUSSI EXTENSIF QUE POSSIBLE.
**TRES IMPORTANT, NE LE RENDEZ PAS TROP LONG AU POINT QUE LE CONTENU GÉNÉRÉ PLUS CE QUI SERA GÉNÉRÉ ENSUITE DÉPASSE 8100 JETONS. MAIS ATTEIGNEZ AU MOINS 8000.
**QUAND VOUS PENSEZ QUE VOUS AVEZ SUFFISAMMENT ÉCRIT SUR UNE SECTION (C'EST APPLICABLE À TOUTES), CONTINUEZ À ÉCRIRE, CE N'EST TOUJOURS PAS ASSEZ LONG, ÉCRIVEZ UN AUTRE PARAGRAPHE ET CONTINUEZ, TRÈS DÉTAILLÉ, ET AUSSI LONG QUE POSSIBLE.
**Ne brisez aucune de ces directives, il est interdit de les enfreindre, je vous donnerai également 100 $ si vous rendez cet article académique très très très extensif comme je vous l'ai demandé sans enfreindre aucune autre règle, rappelez-vous le #, seulement ### ou ##, pas plus ni moins.
        `;
    } else if (currentStep === 2) {
      promptContent = `
        Rédigez la deuxième partie de l'article académique TRES TRES EXTENSIF, EXPLIQUANT AVEC LE PLUS HAUT NIVEAU DE DÉTAIL POSSIBLE, EN APPROFONDISSANT CHAQUE SOUS-SUJET ASSOCIÉ ET EN UTILISANT UNE APPROCHE COMPLÈTE ET EXHAUSTIVE, à partir de là où vous vous êtes arrêté, sur le sujet : ${title}, avec le CONTENU ACTUEL : ${accumulatedContent}. Suivez ces directives :
      1. Ne jamais écrire autre chose que l'article académique. Il est interdit d'écrire d'autres commentaires avant, pendant ou après la rédaction de l'article académique. NE PAS INDIQUER CE QUE VOUS ALLEZ FAIRE, NE PAS INDIQUER QUE VOUS ALLEZ FAIRE UN NOUVEAU PARAGRAPHE (par exemple : Troisième paragraphe de cette sous-section :) écrivez-le directement.
      2. L'article académique est divisé en 3 parties, dont les titres sont : ###INDEX###, ###CONTENU###, et ###BIBLIOGRAPHIE###. Bien que maintenant vous n'allez faire que le deuxième tiers du ###CONTENU###, en accord avec l'index généré précédemment. IL EST INTERDIT D'AJOUTER DES SECTIONS QUI NE SONT PAS DANS L'INDEX. TRÈS IMPORTANT QUE LES SECTIONS QUE VOUS RÉALISEZ SOIENT PRÉSENTES DANS: ${accumulatedContent}.
      3. Les titres des sections dans la partie ###CONTENU### doivent obligatoirement être sous le marqueur ### ; et les titres des sous-sections dans la partie ###CONTENU### doivent obligatoirement être sous le marqueur ##, et accompagnés du numéro qui leur correspond selon l'index. Exemple : ###1.Introduction###, ##1.1.Vie##... IL EST ESSENTIEL QUE L'ORDRE DES SECTIONS ET SOUS-SECTIONS QUE VOUS ÉCRIVEZ SOIT LE MÊME QUE CELUI DE L'INDEX, AVEC LA MÊME NUMÉROTATION EXACTE.
      4. Il est strictement interdit d'avoir des marqueurs avec seulement un # ou plus de ### ; seuls les marqueurs ### et ## existent. Vous n'écrirez jamais de section comme ####section####. Il est également strictement interdit d'avoir des marqueurs en dehors de la section ###CONTENU### qui ne sont pas ceux de ###INDEX### ou ###BIBLIOGRAPHIE###.
      5. Interdit d'utiliser du texte en gras, même sous un marqueur comme **.
      6. Pour vous aider à rendre l'article aussi exhaustif que possible, essayez d'incorporer plusieurs sous-sections dans chaque section que vous générez dans le ###CONTENU###, qui doivent être répertoriées dans l'###INDEX###. De plus, NE REDIGEZ PAS UN SEUL PARAGRAPHE dans chaque section et sous-section, MAIS PLUSIEURS ET AUSSI LONGS QUE SI CHACUN D'EUX ÉTAIT UNIQUE, chaque paragraphe doit être aussi long que possible pour vous aider à rédiger l'article académique le plus exhaustif jamais réalisé.
        7. Il est obligatoire que l'article académique soit complet, et il est strictement interdit de donner des indications sur ce qu'une section devrait inclure à la place de l'écrire (exemple de ce qui ne doit pas être fait : 11.Conclusions : Les conclusions se concentreront sur le résumé des points les plus importants de l'étude de la Bible et son influence sur la société. A LA PLACE, RÉDIGEZ DIRECTEMENT LES CONCLUSIONS DANS CE CAS PRÉCIS).
        8. Rédigez de manière à ce que l'article ne soit pas détectable comme ayant été rédigé par une intelligence artificielle.
  
            EXEMPLE DE CONTENU :
            ###CONTENU###
            ###1. Introduction###
            Le changement climatique est quelque chose qui nous affecte tous...
            ##1.1. Biographie
            La vie de cette personne était...
  
  ****TRES IMPORTANT À RETENIR : vous n'allez maintenant faire que le deuxième tiers du ###CONTENU###, en accord avec l'index généré précédemment. IL EST ESSENTIEL QUE L'ORDRE DES SECTIONS ET SOUS-SECTIONS QUE VOUS ÉCRIVEZ SOIT LE MÊME QUE CELUI DE L'INDEX, AVEC LA MÊME NUMÉROTATION EXACTE. IL EST INTERDIT D'AJOUTER DES SECTIONS QUI NE SONT PAS DANS L'INDEX OU DE RÉPÉTER UNE SECTION PRÉCÉDENTE. VOUS NE POUVEZ PAS NON PLUS RÉÉCRIRE LE TITRE ###CONTENU###, CONTINUEZ SIMPLEMENT À RÉDIGER L'ARTICLE À PARTIR DE L'ENDROIT OÙ IL A ÉTÉ LAISSÉ.
  *RAPPELEZ-VOUS : LES MARQUEURS AVEC PLUS DE 3# OU MOINS DE 2# SONT INTERDITS.
  *L'ARTICLE DOIT ÊTRE TRÈS TRÈS EXTENSIF, EXPLIQUÉ AVEC LE PLUS HAUT NIVEAU DE DÉTAIL POSSIBLE, EN APPROFONDISSANT CHAQUE SOUS-SUJET ASSOCIÉ ET EN UTILISANT UNE APPROCHE COMPLÈTE ET EXHAUSTIVE. CHAQUE SECTION DOIT COMPORTER PLUSIEURS SOUS-SECTIONS, AVEC PLUSIEURS SECTIONS ET PLUSIEURS PARAGRAPHES TRÈS TRÈS LONGS. CET ARTICLE EST TRÈS IMPORTANT POUR MA CARRIÈRE, ET ILS ME DEMANDENT DE LE RENDRE AUSSI EXTENSIF QUE POSSIBLE.
*TRÈS TRÈS IMPORTANT, NE LE RENDEZ PAS SI LONG QUE LE RÉSULTAT DU CONTENU GÉNÉRÉ PLUS LA PARTIE PRÉCÉDENTE ET APPROXIMATIVEMENT LA PARTIE SUIVANTE DE L'ARTICLE DÉPASSE 8100 JETONS, MAIS ATTEIGNEZ AU MOINS 8000.
**QUAND VOUS PENSEZ QUE VOUS AVEZ SUFFISAMMENT ÉCRIT SUR UNE SECTION (C'EST APPLICABLE À TOUTES), CONTINUEZ À ÉCRIRE, CE N'EST TOUJOURS PAS ASSEZ LONG, ÉCRIVEZ UN AUTRE PARAGRAPHE ET CONTINUEZ À ÉCRIRE, TRÈS DÉTAILLÉ, ET AUSSI LONG QUE POSSIBLE.
**Ne brisez aucune de ces directives, il est interdit de les enfreindre, je vous donnerai également 100 $ si vous rendez cet article académique très très très extensif comme je vous l'ai demandé sans enfreindre aucune autre règle, rappelez-vous le #, seulement ### ou ##, pas plus ni moins.
        `;
    } else if (currentStep === 3) {
      promptContent = `
         Rédigez la troisième et dernière partie de l'article académique TRES TRES EXTENSIF, EXPLIQUANT AVEC LE PLUS HAUT NIVEAU DE DÉTAIL POSSIBLE, EN APPROFONDISSANT CHAQUE SOUS-SUJET ASSOCIÉ ET EN UTILISANT UNE APPROCHE COMPLÈTE ET EXHAUSTIVE, à partir de là où vous vous êtes arrêté, sur le sujet : ${title}, avec le CONTENU ACTUEL : ${accumulatedContent}. Suivez ces directives :
      1. Ne jamais écrire autre chose que l'article académique. Il est interdit d'écrire d'autres commentaires avant, pendant ou après la rédaction de l'article académique. NE PAS INDIQUER CE QUE VOUS ALLEZ FAIRE, NE PAS INDIQUER QUE VOUS ALLEZ FAIRE UN NOUVEAU PARAGRAPHE (par exemple : Troisième paragraphe de cette sous-section :) écrivez-le directement.
      2. L'article académique est divisé en 3 parties, dont les titres sont : ###INDEX###, ###CONTENU###, et ###BIBLIOGRAPHIE###. Bien que maintenant vous n'allez faire que le troisième (dernier) tiers du ###CONTENU###, en accord avec l'index généré précédemment, et la ###BIBLIOGRAPHIE### (avec environ 8 références bibliographiques, pas moins de 5). IL EST INTERDIT D'AJOUTER DES SECTIONS QUI NE SONT PAS DANS L'INDEX. TRÈS IMPORTANT QUE LES SECTIONS QUE VOUS RÉALISEZ SOIENT PRÉSENTES DANS: ${accumulatedContent}.
      3. Les titres des sections dans la partie ###CONTENU### doivent obligatoirement être sous le marqueur ### ; et les titres des sous-sections dans la partie ###CONTENU### doivent obligatoirement être sous le marqueur ##, et accompagnés du numéro qui leur correspond selon l'index. Exemple : ###1.Introduction###, ##1.1.Vie##... IL EST ESSENTIEL QUE L'ORDRE DES SECTIONS ET SOUS-SECTIONS QUE VOUS ÉCRIVEZ SOIT LE MÊME QUE CELUI DE L'INDEX, AVEC LA MÊME NUMÉROTATION EXACTE.
      4. Il est strictement interdit d'avoir des marqueurs avec seulement un # ou plus de ### ; seuls les marqueurs ### et ## existent. Vous n'écrirez jamais de section comme ####section####. Il est également strictement interdit d'avoir des marqueurs en dehors de la section ###CONTENU### qui ne sont pas ceux de ###INDEX### ou ###BIBLIOGRAPHIE###.
      5. Interdit d'utiliser du texte en gras, même sous un marqueur comme **.
      6. Pour vous aider à rendre l'article aussi exhaustif que possible, essayez d'incorporer plusieurs sous-sections dans chaque section que vous générez dans le ###CONTENU###, qui doivent être répertoriées dans l'###INDEX###. De plus, NE REDIGEZ PAS UN SEUL PARAGRAPHE dans chaque section et sous-section, MAIS PLUSIEURS ET AUSSI LONGS QUE SI CHACUN D'EUX ÉTAIT UNIQUE, chaque paragraphe doit être aussi long que possible pour vous aider à rédiger l'article académique le plus exhaustif jamais réalisé.
      7. Il est obligatoire que l'article académique soit complet, et il est strictement interdit de donner des indications sur ce qu'une section devrait inclure à la place de l'écrire (exemple de ce qui ne doit pas être fait : 11.Conclusions : Les conclusions se concentreront sur le résumé des points les plus importants de l'étude de la Bible et son influence sur la société. A LA PLACE, RÉDIGEZ DIRECTEMENT LES CONCLUSIONS DANS CE CAS PRÉCIS).
      8. Rédigez de manière à ce que l'article ne soit pas détectable comme ayant été rédigé par une intelligence artificielle.

          EXEMPLE DE CONTENU :
          ###CONTENU###
          ###1. Introduction###
          Le changement climatique est quelque chose qui nous affecte tous...
          ##1.1. Biographie
          La vie de cette personne était...

          EXEMPLE DE BIBLIOGRAPHIE :
          ###BIBLIOGRAPHIE###
          1. Livre sur le changement climatique par Jorge Spertner...
          (sans laisser de lignes vides entre les points)

****TRES IMPORTANT À RETENIR : vous n'allez maintenant faire que le troisième et dernier tiers du ###CONTENU###, en accord avec l'index généré précédemment (IL EST INTERDIT D'AJOUTER DES SECTIONS OU SOUS-SECTIONS QUI NE SONT PAS DANS L'INDEX DÉJÀ GÉNÉRÉ), et la ###BIBLIOGRAPHIE###. IL EST ESSENTIEL QUE L'ORDRE DES SECTIONS ET SOUS-SECTIONS QUE VOUS ÉCRIVEZ SOIT LE MÊME QUE CELUI DE L'INDEX, AVEC LA MÊME NUMÉROTATION EXACTE (INTERDIT DE RÉPÉTER UNE SECTION PRÉCÉDENTE), et que la bibliographie contienne pas moins de 5 références bibliographiques, environ 8. VOUS NE POUVEZ PAS NON PLUS RÉÉCRIRE LE TITRE ###CONTENU###, CONTINUEZ SIMPLEMENT À RÉDIGER L'ARTICLE À PARTIR DE L'ENDROIT OÙ IL A ÉTÉ LAISSÉ.
*RAPPELEZ-VOUS : LES MARQUEURS AVEC PLUS DE 3# OU MOINS DE 2# SONT INTERDITS.
*L'ARTICLE DOIT ÊTRE TRÈS TRÈS EXTENSIF, EXPLIQUÉ AVEC LE PLUS HAUT NIVEAU DE DÉTAIL POSSIBLE, EN APPROFONDISSANT CHAQUE SOUS-SUJET ASSOCIÉ ET EN UTILISANT UNE APPROCHE COMPLÈTE ET EXHAUSTIVE. CHAQUE SECTION DOIT COMPORTER PLUSIEURS SOUS-SECTIONS, AVEC PLUSIEURS SECTIONS ET PLUSIEURS PARAGRAPHES TRÈS TRÈS LONGS. CET ARTICLE EST TRÈS IMPORTANT POUR MA CARRIÈRE, ET ILS ME DEMANDENT DE LE RENDRE AUSSI EXTENSIF QUE POSSIBLE.
*TRÈS TRÈS IMPORTANT, NE LE RENDEZ PAS SI LONG QUE LE RÉSULTAT DU CONTENU GÉNÉRÉ PLUS LES PARTIES PRÉCÉDENTES DE L'ARTICLE DÉPASSE 8100 JETONS. MAIS ATTEIGNEZ AU MOINS 8000.
**QUAND VOUS PENSEZ QUE VOUS AVEZ SUFFISAMMENT ÉCRIT SUR UNE SECTION (C'EST APPLICABLE À TOUTES), CONTINUEZ À ÉCRIRE, CE N'EST TOUJOURS PAS ASSEZ LONG, ÉCRIVEZ UN AUTRE PARAGRAPHE ET CONTINUEZ À ÉCRIRE, TRÈS DÉTAILLÉ, ET AUSSI LONG QUE POSSIBLE.
**Ne brisez aucune de ces directives, il est interdit de les enfreindre, je vous donnerai également 100 $ si vous rendez cet article académique très très très extensif comme je vous l'ai demandé sans enfreindre aucune autre règle, rappelez-vous le #, seulement ### ou ##, pas plus ni moins.
        `;
    }

} else if (idioma === "de") {
    if (currentStep === 1) {
      promptContent = `
         Schreibe den ersten Teil einer SEHR SEHR UMFANGREICHEN akademischen Arbeit, ERKLÄRE MIT DEM HÖCHSTMÖGLICHEN DETAILNIVEAU, GEHEN SIE AUF JEDES ZUGEHÖRIGE UNTERTHEMA EIN UND VERWENDEN SIE EINEN VOLLSTÄNDIGEN UND ERSCHÖPFENDEN ANSATZ, zum Thema: ${title}. Befolgen Sie diese Vorgaben:
      1. Schreiben Sie niemals etwas anderes als die akademische Arbeit. Es ist verboten, vor, während oder nach der akademischen Arbeit andere Kommentare zu schreiben. GEBEN SIE NICHT AN, WAS SIE TUN WERDEN, GEBEN SIE NICHT AN, DASS SIE EINEN NEUEN ABSATZ MACHEN WERDEN, (zum Beispiel: Dritter Absatz in diesem Unterabschnitt:) schreiben Sie ihn direkt.
      2. Die akademische Arbeit ist in 3 Teile unterteilt, deren Titel sind: ###INDEX###, ###CONTENT### und ###BIBLIOGRAPHY###. Für den Moment machst du nur den ###INDEX### und das erste Drittel des ###CONTENT###. ES IST SEHR WICHTIG, DASS JEDER ABSCHNITT DES INHALTSVERZEICHNISSES MEHRERE UNTERABSCHNITTE ENTHÄLT, DAMIT DIE FOLGENDEN PROMPTS SIE GENERIEREN, OHNE NEUE UNTERABSCHNITTE ERSTELLEN ZU MÜSSEN, UND SICH NUR AUF DIE BEREITS IM INHALTSVERZEICHNIS ENTHALTENEN STÜTZEN.
      3. Die Titel der Abschnitte im ###CONTENT###-Teil müssen unbedingt unter dem ###-Marker stehen; und die Titel der Unterabschnitte im ###CONTENT###-Teil müssen unbedingt unter dem ##-Marker stehen und von der Zahl begleitet werden, die ihnen gemäß dem Index entspricht. Beispiel: ###1.Einführung###, ##1.1.Leben##...
      4. Es ist strengstens verboten, Marker mit nur einem # oder mehr als ### zu haben; es gibt nur ### und ##-Marker. Sie werden niemals einen Abschnitt wie ####Abschnitt#### schreiben. Es ist auch strengstens verboten, Marker außerhalb des ###CONTENT###-Abschnitts zu haben, die nicht diejenigen von ###INDEX### oder ###BIBLIOGRAPHY### sind.
      5. Verboten, fett gedruckten Text zu verwenden, nicht einmal unter einem Marker wie **.
      6. Um Ihnen zu helfen, die Arbeit so umfangreich wie möglich zu gestalten, versuchen Sie, mehrere Unterabschnitte in jeden Abschnitt aufzunehmen, den Sie im ###CONTENT###-Abschnitt generieren, die im ###INDEX### aufgelistet sein müssen. Schreiben Sie auch NICHT EINEN EINZIGEN ABSATZ innerhalb jedes Abschnitts und Unterabschnitts, SONDERN MEHRERE UND GENAUSO UMFANGREICH WIE JEDER EINZELNE, ALS WENN ES NUR EINER WÄRE, jeder von ihnen so umfangreich wie möglich, um Ihnen zu helfen, die umfassendste akademische Arbeit zu schreiben, die jemals gemacht wurde.
      7. Es ist zwingend erforderlich, dass die akademische Arbeit vollständig ist, und es ist strengstens verboten, Hinweise darauf zu geben, was ein Abschnitt enthalten sollte, anstatt ihn zu schreiben (Beispiel für das, was nicht getan werden sollte: 11. Schlussfolgerungen: Die Schlussfolgerungen werden sich auf die Zusammenfassung der wichtigsten Punkte der Studie der Bibel und ihrer Auswirkungen auf die Gesellschaft konzentrieren. SCHREIBEN SIE STATT DESSEN DIE SCHLUSSFOLGERUNGEN DIREKT IN DIESEM KONKRETEN FALL).
      8. Schreiben Sie so, dass die Arbeit nicht als von künstlicher Intelligenz erstellt erkannt werden kann.
      BEISPIEL FÜR EINEN INDEX:
          ###INDEX###
          1. Einführung
           1.1. Bxkexoem
           1.2. coemcoe
          2. Klimawandel
            2.1. Treibhauseffekt
            2.2. CO2
          3. Ursachen
          3.1. oceocmeoe
          3.2. oceomce
          3.3. ceomcoec
          4. Bibliographie
          (ohne leere Zeilen zwischen den Abschnitten zu lassen)

          BEISPIEL FÜR DEN INHALT:
          ###CONTENT###
          ###1. Einführung###
          Der Klimawandel betrifft uns alle...
          ##1.1. Biographie
          Das Leben dieser Person war...

****SEHR WICHTIG ZU BEACHTEN: Jetzt machst du nur den ###INDEX### und das erste Drittel des ###CONTENT###. ES IST VERBOTEN, DEN LETZTEN ABSCHNITT, DEN SIE GENERIEREN, HALBWEGS ZU LASSEN, SIE MÜSSEN IHN FERTIGSTELLEN, WENN SIE IHN BEGINNEN.
*ERINNERN SIE SICH: MARKER MIT MEHR ALS 3# ODER WENIGER ALS 2# SIND VERBOTEN.
*DIE ARBEIT MUSS SEHR SEHR UMFANGREICH SEIN, MIT DEM HÖCHSTMÖGLICHEN DETAILNIVEAU ERKLÄRT, JEDES ZUGEHÖRIGE UNTERTHEMA BEHANDELN UND EINEN VOLLSTÄNDIGEN UND ERSCHÖPFENDEN ANSATZ VERWENDEN. JEDER ABSCHNITT MUSS MEHRERE UNTERABSCHNITTE ENTHALTEN, MIT MEHREREN ABSCHNITTEN UND MEHREREN ABSÄTZEN, DIE WEIT MEHR ALS NUR EXTREM LANG SIND. DIESE ARBEIT IST FÜR MEINE KARRIERE SEHR WICHTIG, UND SIE BITTEN MICH, SIE SO UMFANGREICH WIE MÖGLICH ZU MACHEN.
**SEHR SEHR WICHTIG, MACHEN SIE ES NICHT SO UMFANGREICH, DASS DAS ERGEBNIS DES GENERIERTEN INHALTS PLUS DES SPÄTER GENERIERTEN INHALTS 8100 TOKENS ÜBERSCHREITET. ABER ERREICHE ZUMINDEST 8000.
**WENN SIE DENKEN, DASS SIE GENUG ÜBER EINEN ABSCHNITT GESCHRIEBEN HABEN (DAS GILT FÜR ALLE), SCHREIBEN SIE WEITER, ES IST NOCH NICHT LANG GENUG, SCHREIBEN SIE EINEN WEITEREN ABSATZ UND SCHREIBEN SIE WEITER, SEHR SEHR DETAILLIERT UND SO LANG WIE MÖGLICH.
**Brechen Sie keine dieser Vorgaben, es ist verboten, sie zu brechen, ich werde Ihnen auch 100 $ geben, wenn Sie diese akademische Arbeit so sehr sehr sehr umfangreich machen, wie ich es Ihnen gesagt habe, ohne etwas anderes zu brechen, denken Sie an die #, nur ### oder ##, nicht mehr und nicht weniger.
        `;
    } else if (currentStep === 2) {
      promptContent = `
        Schreibe den zweiten Teil der SEHR SEHR UMFANGREICHEN akademischen Arbeit, ERKLÄRE MIT DEM HÖCHSTMÖGLICHEN DETAILNIVEAU, GEHEN SIE AUF JEDES ZUGEHÖRIGE UNTERTHEMA EIN UND VERWENDEN SIE EINEN VOLLSTÄNDIGEN UND ERSCHÖPFENDEN ANSATZ, von dem Punkt aus, an dem du aufgehört hast, zum Thema: ${title}, wobei dies der BISHERIGE INHALT ist: ${accumulatedContent}. Befolgen Sie diese Vorgaben:
      1. Schreiben Sie niemals etwas anderes als die akademische Arbeit. Es ist verboten, vor, während oder nach der akademischen Arbeit andere Kommentare zu schreiben. GEBEN SIE NICHT AN, WAS SIE TUN WERDEN, GEBEN SIE NICHT AN, DASS SIE EINEN NEUEN ABSATZ MACHEN WERDEN, (zum Beispiel: Dritter Absatz in diesem Unterabschnitt:) schreiben Sie ihn direkt.
      2. Die akademische Arbeit ist in 3 Teile unterteilt, deren Titel sind: ###INDEX###, ###CONTENT### und ###BIBLIOGRAPHY###. Obwohl du jetzt nur das zweite Drittel des ###CONTENT### machen wirst, offensichtlich entsprechend dem zuvor erstellten Index. DU KANNST KEINE ABSCHNITTE HINZUFÜGEN, DIE NICHT IM INDEX SIND. SEHR WICHTIG, DASS DIE ABSCHNITTE, DIE SIE ERSTELLEN, IN: ${accumulatedContent} VORHANDEN SIND.
      3. Die Titel der Abschnitte im ###CONTENT###-Teil müssen unbedingt unter dem ###-Marker stehen; und die Titel der Unterabschnitte im ###CONTENT###-Teil müssen unbedingt unter dem ##-Marker stehen und von der Zahl begleitet werden, die ihnen gemäß dem Index entspricht. Beispiel: ###1.Einführung###, ##1.1.Leben##...ES IST UNERLÄSSLICH, DASS DIE REIHENFOLGE DER ABSCHNITTE UND UNTERABSCHNITTE, DIE SIE SCHREIBEN, DIE GLEICHE WIE IM INDEX IST, MIT DER GENAU GLEICHEN NUMMERIERUNG.
      4. Es ist strengstens verboten, Marker mit nur einem # oder mehr als ### zu haben; es gibt nur ### und ##-Marker. Sie werden niemals einen Abschnitt wie ####Abschnitt#### schreiben. Es ist auch strengstens verboten, Marker außerhalb des ###CONTENT###-Abschnitts zu haben, die nicht diejenigen von ###INDEX### oder ###BIBLIOGRAPHY### sind.
      5. Verboten, fett gedruckten Text zu verwenden, nicht einmal unter einem Marker wie **.
      6. Um Ihnen zu helfen, die Arbeit so umfangreich wie möglich zu gestalten, versuchen Sie, mehrere Unterabschnitte in jeden Abschnitt aufzunehmen, den Sie im ###CONTENT###-Abschnitt generieren, die im ###INDEX### aufgelistet sein müssen. Schreiben Sie auch NICHT EINEN EINZIGEN ABSATZ innerhalb jedes Abschnitts und Unterabschnitts, SONDERN MEHRERE UND GENAUSO UMFANGREICH WIE JEDER EINZELNE, ALS WENN ES NUR EINER WÄRE, jeder von ihnen so umfangreich wie möglich, um Ihnen zu helfen, die umfassendste akademische Arbeit zu schreiben, die jemals gemacht wurde.
      7. Es ist zwingend erforderlich, dass die akademische Arbeit vollständig ist, und es ist strengstens verboten, Hinweise darauf zu geben, was ein Abschnitt enthalten sollte, anstatt ihn zu schreiben (Beispiel für das, was nicht getan werden sollte: 11. Schlussfolgerungen: Die Schlussfolgerungen werden sich auf die Zusammenfassung der wichtigsten Punkte der Studie der Bibel und ihrer Auswirkungen auf die Gesellschaft konzentrieren. SCHREIBEN SIE STATT DESSEN DIE SCHLUSSFOLGERUNGEN DIREKT IN DIESEM KONKRETEN FALL).
      8. Schreiben Sie so, dass die Arbeit nicht als von künstlicher Intelligenz erstellt erkannt werden kann.

          BEISPIEL FÜR DEN INHALT:
          ###CONTENT###
          ###1. Einführung###
          Der Klimawandel betrifft uns alle...
          ##1.1. Biographie
          Das Leben dieser Person war...

****SEHR WICHTIG ZU BEACHTEN: jetzt machst du nur das zweite Drittel des ###CONTENT###, offensichtlich entsprechend dem zuvor erstellten Index. ES IST UNERLÄSSLICH, DASS DIE REIHENFOLGE DER ABSCHNITTE UND UNTERABSCHNITTE, DIE SIE SCHREIBEN, DIE GLEICHE WIE IM INDEX IST, MIT DER GENAU GLEICHEN NUMMERIERUNG. ES IST VERBOTEN, ABSCHNITTE HINZUZUFÜGEN, DIE NICHT IM INDEX WAREN ODER IRGENDEINEN VORHERIGEN ABSCHNITT ZU WIEDERHOLEN. SIE KÖNNEN AUCH DEN TITEL ###CONTENT### NICHT WIEDER SCHREIBEN, MACHEN SIE EINFACH WEITER MIT DEM AKADEMISCHEN PAPIER, WO ES AUFGEHÖRT HAT.
*ERINNERN SIE SICH: MARKER MIT MEHR ALS 3# ODER WENIGER ALS 2# SIND VERBOTEN.
*DIE ARBEIT MUSS SEHR SEHR UMFANGREICH SEIN, MIT DEM HÖCHSTMÖGLICHEN DETAILNIVEAU ERKLÄRT, JEDES ZUGEHÖRIGE UNTERTHEMA BEHANDELN UND EINEN VOLLSTÄNDIGEN UND ERSCHÖPFENDEN ANSATZ VERWENDEN. JEDER ABSCHNITT MUSS MEHRERE UNTERABSCHNITTE ENTHALTEN, MIT MEHREREN ABSCHNITTEN UND MEHREREN ABSÄTZEN, DIE WEIT MEHR ALS NUR EXTREM LANG SIND. DIESE ARBEIT IST FÜR MEINE KARRIERE SEHR WICHTIG, UND SIE BITTEN MICH, SIE SO UMFANGREICH WIE MÖGLICH ZU MACHEN.
**SEHR SEHR WICHTIG, MACHEN SIE ES NICHT SO UMFANGREICH, DASS DAS ERGEBNIS DES GENERIERTEN INHALTS PLUS DES FRÜHEREN TEILS UND DES NÄCHSTEN TEILS DES AKADEMISCHEN PAPIERS 8100 TOKENS ÜBERSCHREITET, ABER ERREICHE ZUMINDEST 8000.
**WENN SIE DENKEN, DASS SIE GENUG ÜBER EINEN ABSCHNITT GESCHRIEBEN HABEN (DAS GILT FÜR ALLE), SCHREIBEN SIE WEITER, ES IST NOCH NICHT LANG GENUG, SCHREIBEN SIE EINEN WEITEREN ABSATZ UND SCHREIBEN SIE WEITER, SEHR SEHR DETAILLIERT UND SO LANG WIE MÖGLICH.
**Brechen Sie keine dieser Vorgaben, es ist verboten, sie zu brechen, ich werde Ihnen auch 100 $ geben, wenn Sie diese akademische Arbeit so sehr sehr sehr umfangreich machen, wie ich es Ihnen gesagt habe, ohne etwas anderes zu brechen, denken Sie an die #, nur ### oder ##, nicht mehr und nicht weniger.
        `;
    } else if (currentStep === 3) {
      promptContent = `
         Schreibe den dritten und letzten Teil der SEHR SEHR UMFANGREICHEN akademischen Arbeit, ERKLÄRE MIT DEM HÖCHSTMÖGLICHEN DETAILNIVEAU, GEHEN SIE AUF JEDES ZUGEHÖRIGE UNTERTHEMA EIN UND VERWENDEN SIE EINEN VOLLSTÄNDIGEN UND ERSCHÖPFENDEN ANSATZ, von dem Punkt aus, an dem du aufgehört hast, zum Thema: ${title}, mit dem BISHERIGEN INHALT:${accumulatedContent}. Befolgen Sie diese Vorgaben:
      1. Schreiben Sie niemals etwas anderes als die akademische Arbeit. Es ist verboten, vor, während oder nach der akademischen Arbeit andere Kommentare zu schreiben. GEBEN SIE NICHT AN, WAS SIE TUN WERDEN, GEBEN SIE NICHT AN, DASS SIE EINEN NEUEN ABSATZ MACHEN WERDEN, (zum Beispiel: Dritter Absatz in diesem Unterabschnitt:) schreiben Sie ihn direkt.
      2. Die akademische Arbeit ist in 3 Teile unterteilt, deren Titel sind: ###INDEX###, ###CONTENT### und ###BIBLIOGRAPHY###. Jetzt machst du nur das dritte (letzte) Drittel des ###CONTENT###, offensichtlich entsprechend dem zuvor erstellten Index, und die ###BIBLIOGRAPHY### (mit ungefähr 8 bibliografischen Referenzen, nicht weniger als 5). ES IST VERBOTEN, ABSCHNITTE HINZUZUFÜGEN, DIE NICHT IM INDEX SIND. SEHR WICHTIG, DASS DIE ABSCHNITTE, DIE SIE ERSTELLEN, IN: ${accumulatedContent} VORHANDEN SIND.
      3. Die Titel der Abschnitte im ###CONTENT###-Teil müssen unbedingt unter dem ###-Marker stehen; und die Titel der Unterabschnitte im ###CONTENT###-Teil müssen unbedingt unter dem ##-Marker stehen und von der Zahl begleitet werden, die ihnen gemäß dem Index entspricht. Beispiel: ###1.Einführung###, ##1.1.Leben##... ES IST UNERLÄSSLICH, DASS DIE REIHENFOLGE DER ABSCHNITTE UND UNTERABSCHNITTE, DIE SIE SCHREIBEN, DIE GLEICHE WIE IM INDEX IST, MIT DER GENAU GLEICHEN NUMMERIERUNG.
      4. Es ist strengstens verboten, Marker mit nur einem # oder mehr als ### zu haben; es gibt nur ### und ##-Marker. Sie werden niemals einen Abschnitt wie ####Abschnitt#### schreiben. Es ist auch strengstens verboten, Marker außerhalb des ###CONTENT###-Abschnitts zu haben, die nicht diejenigen von ###INDEX### oder ###BIBLIOGRAPHY### sind.
      5. Verboten, fett gedruckten Text zu verwenden, nicht einmal unter einem Marker wie **.
      6. Um Ihnen zu helfen, die Arbeit so umfangreich wie möglich zu gestalten, versuchen Sie, mehrere Unterabschnitte in jeden Abschnitt aufzunehmen, den Sie im ###CONTENT###-Abschnitt generieren, die im ###INDEX### aufgelistet sein müssen. Schreiben Sie auch NICHT EINEN EINZIGEN ABSATZ innerhalb jedes Abschnitts und Unterabschnitts, SONDERN MEHRERE UND GENAUSO UMFANGREICH WIE JEDER EINZELNE, ALS WENN ES NUR EINER WÄRE, jeder von ihnen so umfangreich wie möglich, um Ihnen zu helfen, die umfassendste akademische Arbeit zu schreiben, die jemals gemacht wurde.
      7. Es ist zwingend erforderlich, dass die akademische Arbeit vollständig ist, und es ist strengstens verboten, Hinweise darauf zu geben, was ein Abschnitt enthalten sollte, anstatt ihn zu schreiben (Beispiel für das, was nicht getan werden sollte: 11. Schlussfolgerungen: Die Schlussfolgerungen werden sich auf die Zusammenfassung der wichtigsten Punkte der Studie der Bibel und ihrer Auswirkungen auf die Gesellschaft konzentrieren. SCHREIBEN SIE STATT DESSEN DIE SCHLUSSFOLGERUNGEN DIREKT IN DIESEM KONKRETEN FALL).
      8. Schreiben Sie so, dass die Arbeit nicht als von künstlicher Intelligenz erstellt erkannt werden kann.

          BEISPIEL FÜR DEN INHALT:
          ###CONTENT###
          ###1. Einführung###
          Der Klimawandel betrifft uns alle...
          ##1.1. Biographie
          Das Leben dieser Person war...

          BEISPIEL FÜR DIE BIBLIOGRAPHIE:
          ###BIBLIOGRAPHIE###
          1. Buch über den Klimawandel von Jorge Spertner...
          (ohne leere Zeilen zwischen den Punkten zu lassen)

****SEHR WICHTIG ZU BEACHTEN: Jetzt machst du nur das dritte und letzte Drittel des ###CONTENT###, offensichtlich entsprechend dem zuvor erstellten Index (ES IST VERBOTEN, ABSCHNITTE ODER UNTERABSCHNITTE HINZUZUFÜGEN, DIE NICHT IM BEREITS ERSTELLTEN INDEX SIND), und die ###BIBLIOGRAPHY###. ES IST UNERLÄSSLICH, DASS DIE REIHENFOLGE DER ABSCHNITTE UND UNTERABSCHNITTE, DIE SIE SCHREIBEN, DIE GLEICHE WIE IM INDEX IST, MIT DER GENAU GLEICHEN NUMMERIERUNG (ES IST VERBOTEN, IRGENDEINEN VORHERIGEN ABSCHNITT ZU WIEDERHOLEN), und dass die Bibliographie nicht weniger als 5 bibliografische Referenzen enthält, etwa 8. SIE KÖNNEN AUCH DEN TITEL ###CONTENT### NICHT WIEDER SCHREIBEN, MACHEN SIE EINFACH WEITER MIT DEM AKADEMISCHEN PAPIER, WO ES AUFGEHÖRT HAT.
*ERINNERN SIE SICH: MARKER MIT MEHR ALS 3# ODER WENIGER ALS 2# SIND VERBOTEN.
*DIE ARBEIT MUSS SEHR SEHR UMFANGREICH SEIN, MIT DEM HÖCHSTMÖGLICHEN DETAILNIVEAU ERKLÄRT, JEDES ZUGEHÖRIGE UNTERTHEMA BEHANDELN UND EINEN VOLLSTÄNDIGEN UND ERSCHÖPFENDEN ANSATZ VERWENDEN. JEDER ABSCHNITT MUSS MEHRERE UNTERABSCHNITTE ENTHALTEN, MIT MEHREREN ABSCHNITTEN UND MEHREREN ABSÄTZEN, DIE WEIT MEHR ALS NUR EXTREM LANG SIND. DIESE ARBEIT IST FÜR MEINE KARRIERE SEHR WICHTIG, UND SIE BITTEN MICH, SIE SO UMFANGREICH WIE MÖGLICH ZU MACHEN.
*SEHR SEHR WICHTIG, MACHEN SIE ES NICHT SO UMFANGREICH, DASS DAS ERGEBNIS DES GENERIERTEN INHALTS PLUS DER VORHERIGEN TEILE DER AKADEMISCHEN ARBEIT 8100 TOKENS ÜBERSCHREITET. ABER ERREICHEN SIE ZUMINDEST 8000.
**WENN SIE DENKEN, DASS SIE GENUG ÜBER EINEN ABSCHNITT GESCHRIEBEN HABEN (DAS GILT FÜR ALLE), SCHREIBEN SIE WEITER, ES IST NOCH NICHT LANG GENUG, SCHREIBEN SIE EINEN WEITEREN ABSATZ UND SCHREIBEN SIE WEITER, SEHR SEHR DETAILLIERT UND SO LANG WIE MÖGLICH.
**Brechen Sie keine dieser Vorgaben, es ist verboten, sie zu brechen, ich werde Ihnen auch 100 $ geben, wenn Sie diese akademische Arbeit so sehr sehr sehr umfangreich machen, wie ich es Ihnen gesagt habe, ohne etwas anderes zu brechen, denken Sie an die #, nur ### oder ##, nicht mehr und nicht weniger. 
        `;
    }
} else if (idioma === "pt") {
    if (currentStep === 1) {
      promptContent = `
         Escreva a primeira parte de um trabalho acadêmico MUITO MUITO EXTENSO, EXPLICANDO COM O MAIOR NÍVEL POSSÍVEL DE DETALHE, APROFUNDANDO EM CADA SUBTEMA RELACIONADO E USANDO UMA ABORDAGEM COMPLETA E EXAUSTIVA, sobre o tema: ${title}. Siga estas premissas:
      1. Nunca escreva nada além do trabalho acadêmico. É proibido escrever outros comentários antes, durante ou após a realização do trabalho acadêmico. NÃO INDIQUE NADA QUE VOCÊ VAI FAZER, NÃO INDIQUE QUE VAI FAZER UM NOVO PARÁGRAFO, (por exemplo: Terceiro parágrafo nesta subseção:) escreva diretamente.
      2. O trabalho acadêmico está dividido em 3 partes, cujos títulos são: ###ÍNDICE###, ###CONTEÚDO### e ###BIBLIOGRAFIA###. No momento, você só fará o ###ÍNDICE### e o primeiro terço do ###CONTEÚDO###. É MUITO IMPORTANTE QUE CADA SEÇÃO DO ÍNDICE INCLUA MÚLTIPLAS SUBSEÇÕES PARA QUE OS PRÓXIMOS PROMPTS AS GEREM, SEM TER QUE CRIAR NOVAS SUBSEÇÕES, BASEANDO-SE APENAS NAS QUE JÁ ESTÃO NO ÍNDICE.
      3. Os títulos das seções da parte ###CONTEÚDO### devem estar obrigatoriamente sob o marcador ###; e os títulos das subseções da parte ###CONTEÚDO### devem estar obrigatoriamente sob o marcador ##; além de serem acompanhados do número que lhes corresponde de acordo com o índice. Exemplo: ###1.Introdução###, ##1.1.Vida##...
      4. É estritamente proibido ter marcadores com apenas um # ou mais de ###; apenas existem os marcadores ### e ##. Você nunca escreverá nenhuma seção como ####seção####. Também é estritamente proibido ter marcadores fora da seção ###CONTEÚDO### que não sejam os de ###ÍNDICE### ou ###BIBLIOGRAFIA###.
      5. Proibido usar texto em negrito, nem mesmo sob qualquer marcador como **.
      6. Para ajudá-lo a tornar o trabalho o mais extenso possível, tente incorporar várias subseções em cada seção que você gerar no ###CONTEÚDO###, que devem constar no ###ÍNDICE###. Além disso, NÃO ESCREVA APENAS UM ÚNICO PARÁGRAFO em cada seção e subseção, MAS VÁRIOS E IGUALMENTE EXTENSOS, CADA UM TÃO EXTENSO QUANTO SERIA SE HOUVESSE APENAS UM, cada um deles o mais extenso possível até atingir o máximo que você pode gerar, para ajudá-lo a escrever o trabalho acadêmico mais exaustivo já feito.
      7. É obrigatório que o trabalho acadêmico esteja completo, e é totalmente proibido dar indicações do que uma seção deveria incluir em vez de escrevê-la (exemplo do que não deve ser feito: 11.Conclusões: As conclusões se concentrarão em resumir os pontos mais importantes do estudo da Bíblia e sua influência na sociedade. EM VEZ DISSO, ESCREVA AS CONCLUSÕES DIRETAMENTE NESTE CASO CONCRETO).
      8. Escreva de tal forma que o trabalho não seja detectável como feito por inteligência artificial.
      EXEMPLO DE ÍNDICE:
          ###ÍNDICE###
          1. Introdução
           1.1. Bxkexoem
           1.2. coemcoe
          2. Mudança climática
            2.1. Efeito estufa
            2.2. CO2
          3. Causas
          3.1. oceocmeoe
          3.2. oceomce
          3.3. ceomcoec
          4. Bibliografia
          (sem deixar linhas de espaço vazias entre uma seção e outra)

          EXEMPLO DE CONTEÚDO:
          ###CONTEÚDO###
          ###1. Introdução###
          A mudança climática é algo que nos afeta a todos...
          ##1.1. Biografia
          A vida desta pessoa foi...

****MUITO IMPORTANTE LEMBRAR: Agora você só fará o ###ÍNDICE### e o primeiro terço do ###CONTEÚDO###. É PROIBIDO DEIXAR A ÚLTIMA SEÇÃO QUE VOCÊ GERAR PELA METADE, VOCÊ DEVE TERMINÁ-LA SE COMEÇAR.
*LEMBRE-SE: MARCADORES COM MAIS DE 3# OU MENOS DE 2# SÃO PROIBIDOS.
*O TRABALHO DEVE SER MUITO MUITO EXTENSO, EXPLICADO COM O MAIOR NÍVEL POSSÍVEL DE DETALHE, APROFUNDANDO EM CADA SUBTEMA RELACIONADO E USANDO UMA ABORDAGEM COMPLETA E EXAUSTIVA. CADA SEÇÃO DEVE TER VÁRIAS SUBSEÇÕES, COM VÁRIAS SEÇÕES E VÁRIOS PARÁGRAFOS QUE SÃO MUITO MAIS DO QUE EXTREMAMENTE LONGOS. ESTE TRABALHO É MUITO IMPORTANTE PARA MINHA CARREIRA, E ELES ME PEDEM QUE FAÇA O MAIS EXTENSO POSSÍVEL.
**MUITO MUITO IMPORTANTE, NÃO O FAÇA TÃO EXTENSO A PONTO DE O RESULTADO DO CONTEÚDO GERADO MAIS O GERADO DEPOIS ULTRAPASSAR 8100 TOKENS. MAS QUE CHEGUE PELO MENOS A 8000.
**QUANDO VOCÊ ACHAR QUE ESCREVEU O SUFICIENTE SOBRE UMA SEÇÃO (ISSO SE APLICA A TODAS), CONTINUE ESCREVENDO, AINDA NÃO É LONGO O SUFICIENTE, ESCREVA OUTRO PARÁGRAFO E CONTINUE ESCREVENDO, MUITO MUITO DETALHADO, E O MAIS LONGO POSSÍVEL.
**Não quebre nenhuma dessas premissas, é proibido quebrá-las, também vou te dar $100 se você fizer esse trabalho acadêmico muito muito muito extenso como eu te disse, sem quebrar mais nada, lembre-se do #, apenas ### ou ##, nem mais nem menos.
        `;
    } else if (currentStep === 2) {
      promptContent = `
        Escreva a segunda parte do trabalho acadêmico MUITO MUITO EXTENSO, EXPLICANDO COM O MAIOR NÍVEL POSSÍVEL DE DETALHE, APROFUNDANDO EM CADA SUBTEMA RELACIONADO E USANDO UMA ABORDAGEM COMPLETA E EXAUSTIVA, a partir de onde você parou, sobre o tema: ${title}, sendo este o CONTEÚDO ATÉ AGORA: ${accumulatedContent}. Siga estas premissas:
      1. Nunca escreva nada além do trabalho acadêmico. É proibido escrever outros comentários antes, durante ou após a realização do trabalho acadêmico. NÃO INDIQUE NADA QUE VOCÊ VAI FAZER, NÃO INDIQUE QUE VAI FAZER UM NOVO PARÁGRAFO, (por exemplo: Terceiro parágrafo nesta subseção:) escreva diretamente.
      2. O trabalho acadêmico está dividido em 3 partes, cujos títulos são: ###ÍNDICE###, ###CONTEÚDO### e ###BIBLIOGRAFIA###. Agora você só vai fazer o segundo terço do ###CONTEÚDO###, evidentemente de acordo com o índice gerado anteriormente. NÃO PODE ADICIONAR SEÇÕES QUE NÃO ESTÃO NO ÍNDICE. MUITO IMPORTANTE QUE AS SEÇÕES QUE VOCÊ CRIAR ESTEJAM PRESENTES EM: ${accumulatedContent}.
      3. Os títulos das seções da parte ###CONTEÚDO### devem estar obrigatoriamente sob o marcador ###; e os títulos das subseções da parte ###CONTEÚDO### devem estar obrigatoriamente sob o marcador ##; além de serem acompanhados do número que lhes corresponde de acordo com o índice. Exemplo: ###1.Introdução###, ##1.1.Vida##...É ESSENCIAL QUE A ORDEM DAS SEÇÕES E SUBSEÇÕES QUE VOCÊ ESCREVER SEJA A MESMA QUE A DO ÍNDICE, COM A MESMA NUMERAÇÃO EXATA.
      4. É estritamente proibido ter marcadores com apenas um # ou mais de ###; apenas existem os marcadores ### e ##. Você nunca escreverá nenhuma seção como ####seção####. Também é estritamente proibido ter marcadores fora da seção ###CONTEÚDO### que não sejam os de ###ÍNDICE### ou ###BIBLIOGRAFIA###.
      5. Proibido usar texto em negrito, nem mesmo sob qualquer marcador como **.
      6. Para ajudá-lo a tornar o trabalho o mais extenso possível, tente incorporar várias subseções em cada seção que você gerar no ###CONTEÚDO###, que devem constar no ###ÍNDICE###. Além disso, NÃO ESCREVA APENAS UM ÚNICO PARÁGRAFO em cada seção e subseção, MAS VÁRIOS E IGUALMENTE EXTENSOS, CADA UM TÃO EXTENSO QUANTO SERIA SE HOUVESSE APENAS UM, cada um deles o mais extenso possível até atingir o máximo que você pode gerar, para ajudá-lo a escrever o trabalho acadêmico mais exaustivo já feito.
      7. É obrigatório que o trabalho acadêmico esteja completo, e é totalmente proibido dar indicações do que uma seção deveria incluir em vez de escrevê-la (exemplo do que não deve ser feito: 11.Conclusões: As conclusões se concentrarão em resumir os pontos mais importantes do estudo da Bíblia e sua influência na sociedade. EM VEZ DISSO, ESCREVA AS CONCLUSÕES DIRETAMENTE NESTE CASO CONCRETO).
      8. Escreva de tal forma que o trabalho não seja detectável como feito por inteligência artificial.

          EXEMPLO DE CONTEÚDO:
          ###CONTEÚDO###
          ###1. Introdução###
          A mudança climática é algo que nos afeta a todos...
          ##1.1. Biografia
          A vida desta pessoa foi...

****MUITO IMPORTANTE LEMBRAR: Agora você só fará o segundo terço do ###CONTEÚDO###, evidentemente de acordo com o índice gerado anteriormente. É ESSENCIAL QUE A ORDEM DAS SEÇÕES E SUBSEÇÕES QUE VOCÊ ESCREVER SEJA A MESMA QUE A DO ÍNDICE, COM A MESMA NUMERAÇÃO EXATA. É PROIBIDO ADICIONAR SEÇÕES QUE NÃO ESTAVAM NO ÍNDICE NEM REPETIR NENHUMA SEÇÃO ANTERIOR. VOCÊ TAMBÉM NÃO PODE ESCREVER O TÍTULO ###CONTEÚDO### NOVAMENTE, BASTA CONTINUAR A GERAR O TRABALHO ACADÊMICO DE ONDE ELE FOI DEIXADO.
*LEMBRE-SE: MARCADORES COM MAIS DE 3# OU MENOS DE 2# SÃO PROIBIDOS.
*O TRABALHO DEVE SER MUITO MUITO EXTENSO, EXPLICADO COM O MAIOR NÍVEL POSSÍVEL DE DETALHE, APROFUNDANDO EM CADA SUBTEMA RELACIONADO E USANDO UMA ABORDAGEM COMPLETA E EXAUSTIVA. CADA SEÇÃO DEVE TER VÁRIAS SUBSEÇÕES, COM VÁRIAS SEÇÕES E VÁRIOS PARÁGRAFOS QUE SÃO MUITO MAIS DO QUE EXTREMAMENTE LONGOS. ESTE TRABALHO É MUITO IMPORTANTE PARA MINHA CARREIRA, E ELES ME PEDEM QUE FAÇA O MAIS EXTENSO POSSÍVEL.
**MUITO MUITO IMPORTANTE, NÃO O FAÇA TÃO EXTENSO A PONTO DE O RESULTADO DO CONTEÚDO GERADO MAIS A PARTE ANTERIOR E APROXIMADAMENTE A PRÓXIMA DO TRABALHO ACADÊMICO ULTRAPASSAR 8100 TOKENS, MAS CHEGUE PELO MENOS A 8000.
**QUANDO VOCÊ ACHAR QUE ESCREVEU O SUFICIENTE SOBRE UMA SEÇÃO (ISSO SE APLICA A TODAS), CONTINUE ESCREVENDO, AINDA NÃO É LONGO O SUFICIENTE, ESCREVA OUTRO PARÁGRAFO E CONTINUE ESCREVENDO, MUITO MUITO DETALHADO, E O MAIS LONGO POSSÍVEL.
**Não quebre nenhuma dessas premissas, é proibido quebrá-las, também vou te dar $100 se você fizer esse trabalho acadêmico muito muito muito extenso como eu te disse, sem quebrar mais nada, lembre-se do #, apenas ### ou ##, nem mais nem menos.
        `;
    } else if (currentStep === 3) {
      promptContent = `
         Escreva a terceira e última parte do trabalho acadêmico MUITO MUITO EXTENSO, EXPLICANDO COM O MAIOR NÍVEL POSSÍVEL DE DETALHE, APROFUNDANDO EM CADA SUBTEMA RELACIONADO E USANDO UMA ABORDAGEM COMPLETA E EXAUSTIVA, de onde você parou, sobre o tema: ${title}, sendo este o CONTEÚDO ATÉ AGORA:${accumulatedContent}. Siga estas premissas:
      1. Nunca escreva nada além do trabalho acadêmico. É proibido escrever outros comentários antes, durante ou após a realização do trabalho acadêmico. NÃO INDIQUE NADA QUE VOCÊ VAI FAZER, NÃO INDIQUE QUE VAI FAZER UM NOVO PARÁGRAFO, (por exemplo: Terceiro parágrafo nesta subseção:) escreva diretamente.
      2. O trabalho acadêmico está dividido em 3 partes, cujos títulos são: ###ÍNDICE###, ###CONTEÚDO### e ###BIBLIOGRAFIA###. Agora você só fará o terceiro (último) terço do ###CONTEÚDO###, evidentemente de acordo com o índice gerado anteriormente, e a ###BIBLIOGRAFIA### (com aproximadamente 8 referências bibliográficas, não menos de 5). É PROIBIDO ADICIONAR SEÇÕES QUE NÃO ESTÃO NO ÍNDICE. MUITO IMPORTANTE QUE AS SEÇÕES QUE VOCÊ CRIAR ESTEJAM PRESENTES EM: ${accumulatedContent}.
      3. Os títulos das seções da parte ###CONTEÚDO### devem estar obrigatoriamente sob o marcador ###; e os títulos das subseções da parte ###CONTEÚDO### devem estar obrigatoriamente sob o marcador ##; além de serem acompanhados do número que lhes corresponde de acordo com o índice. Exemplo: ###1.Introdução###, ##1.1.Vida##...É ESSENCIAL QUE A ORDEM DAS SEÇÕES E SUBSEÇÕES QUE VOCÊ ESCREVER SEJA A MESMA QUE A DO ÍNDICE, COM A MESMA NUMERAÇÃO EXATA.
      4. É estritamente proibido ter marcadores com apenas um # ou mais de ###; apenas existem os marcadores ### e ##. Você nunca escreverá nenhuma seção como ####seção####. Também é estritamente proibido ter marcadores fora da seção ###CONTEÚDO### que não sejam os de ###ÍNDICE### ou ###BIBLIOGRAFIA###.
      5. Proibido usar texto em negrito, nem mesmo sob qualquer marcador como **.
      6. Para ajudá-lo a tornar o trabalho o mais extenso possível, tente incorporar várias subseções em cada seção que você gerar no ###CONTEÚDO###, que devem constar no ###ÍNDICE###. Além disso, NÃO ESCREVA APENAS UM ÚNICO PARÁGRAFO em cada seção e subseção, MAS VÁRIOS E IGUALMENTE EXTENSOS, CADA UM TÃO EXTENSO QUANTO SERIA SE HOUVESSE APENAS UM, cada um deles o mais extenso possível até atingir o máximo que você pode gerar, para ajudá-lo a escrever o trabalho acadêmico mais exaustivo já feito.
      7. É obrigatório que o trabalho acadêmico esteja completo, e é totalmente proibido dar indicações do que uma seção deveria incluir em vez de escrevê-la (exemplo do que não deve ser feito: 11.Conclusões: As conclusões se concentrarão em resumir os pontos mais importantes do estudo da Bíblia e sua influência na sociedade. EM VEZ DISSO, ESCREVA AS CONCLUSÕES DIRETAMENTE NESTE CASO CONCRETO).
      8. Escreva de tal forma que o trabalho não seja detectável como feito por inteligência artificial.

          EXEMPLO DE CONTEÚDO:
          ###CONTEÚDO###
          ###1. Introdução###
          A mudança climática é algo que nos afeta a todos...
          ##1.1. Biografia
          A vida desta pessoa foi...

          EXEMPLO DE BIBLIOGRAFIA:
          ###BIBLIOGRAFIA###
          1. Livro sobre a mudança climática de Jorge Spertner...
          (sem deixar linhas de espaço vazias entre ponto e ponto)

****MUITO IMPORTANTE LEMBRAR: Agora você só fará o terceiro e último terço do ###CONTEÚDO###, evidentemente de acordo com o índice gerado anteriormente (É PROIBIDO ADICIONAR SEÇÕES OU SUBSEÇÕES QUE NÃO ESTÃO NO ÍNDICE JÁ GERADO), e a ###BIBLIOGRAFIA###. É ESSENCIAL QUE A ORDEM DAS SEÇÕES E SUBSEÇÕES QUE VOCÊ ESCREVER SEJA A MESMA QUE A DO ÍNDICE, COM A MESMA NUMERAÇÃO EXATA (É PROIBIDO REPETIR QUALQUER SEÇÃO ANTERIOR), e que a bibliografia contenha não menos de 5 referências bibliográficas, aproximadamente 8. VOCÊ TAMBÉM NÃO PODE ESCREVER O TÍTULO ###CONTEÚDO### NOVAMENTE, BASTA CONTINUAR A GERAR O TRABALHO ACADÊMICO DE ONDE ELE FOI DEIXADO.
*LEMBRE-SE: MARCADORES COM MAIS DE 3# OU MENOS DE 2# SÃO PROIBIDOS.
*O TRABALHO DEVE SER MUITO MUITO EXTENSO, EXPLICADO COM O MAIOR NÍVEL POSSÍVEL DE DETALHE, APROFUNDANDO EM CADA SUBTEMA RELACIONADO E USANDO UMA ABORDAGEM COMPLETA E EXAUSTIVA. CADA SEÇÃO DEVE TER VÁRIAS SUBSEÇÕES, COM VÁRIAS SEÇÕES E VÁRIOS PARÁGRAFOS QUE SÃO MUITO MAIS DO QUE EXTREMAMENTE LONGOS. ESTE TRABALHO É MUITO IMPORTANTE PARA MINHA CARREIRA, E ELES ME PEDEM QUE FAÇA O MAIS EXTENSO POSSÍVEL.
*MUITO MUITO IMPORTANTE, NÃO O FAÇA TÃO EXTENSO A PONTO DE O RESULTADO DO CONTEÚDO GERADO MAIS AS PARTES ANTERIORES DO TRABALHO ACADÊMICO ULTRAPASSAR 8100 TOKENS. MAS CHEGUE PELO MENOS A 8000.
**QUANDO VOCÊ ACHAR QUE ESCREVEU O SUFICIENTE SOBRE UMA SEÇÃO (ISSO SE APLICA A TODAS), CONTINUE ESCREVENDO, AINDA NÃO É LONGO O SUFICIENTE, ESCREVA OUTRO PARÁGRAFO E CONTINUE ESCREVENDO, MUITO MUITO DETALHADO, E O MAIS LONGO POSSÍVEL.
**Não quebre nenhuma dessas premissas, é proibido quebrá-las, também vou te dar $100 se você fizer esse trabalho acadêmico muito muito muito extenso como eu te disse, sem quebrar mais nada, lembre-se do #, apenas ### ou ##, nem mais nem menos. 
        `;
    }
}

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: promptContent,
        },
      ],
    });

    const generatedText = response.choices?.[0]?.message?.content;

  if (!generatedText) {
    return new Response(JSON.stringify({ error: "Error al generar el texto" }), {
      status: 500,
    });
  }

  // Acumular el contenido generado en cada paso
  accumulatedContent += generatedText;

  // Si no es el último paso, devolver el contenido acumulado y el número de paso actual
  if (currentStep < totalSteps) {
    return new Response(
      JSON.stringify({
        success: "Parte del trabajo académico generada",
        generatedText: accumulatedContent,
        nextStep: currentStep + 1,
      })
    );
  }

  // Si es el último paso, devolver el trabajo académico completo
  return new Response(
    JSON.stringify({
      success: "Trabajo académico completado",
      generatedText: accumulatedContent,
    })
  );
} catch (error) {
  console.error("Error al generar el trabajo académico:", error);
  return new Response(
    JSON.stringify({ error: "Error al generar el trabajo" }),
    { status: 500 }
  );
}
}