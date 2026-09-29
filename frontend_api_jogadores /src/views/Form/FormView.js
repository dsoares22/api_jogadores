import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../services/api";
import { mensagemErroApi } from "../../services/erros";

const novoJogador = (chave) => ({
  chave,
  nome: "",
  posicao: "",
  clube: "",
  numeroCamisa: null,
  idade: null,
  quantidadeGols: 0,
  quantidadePartidas: 0,
  ativo: true,
});

export default {
  name: "FormView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const idEdicao = route.params.id;
    let proximaChave = 1;
    const jogadoresFormulario = ref([novoJogador(proximaChave++)]);
    const salvando = ref(false);
    const erroSalvar = ref("");
    const carregando = ref(Boolean(idEdicao));
    const erroCarregar = ref("");

    const adicionarJogador = () => {
      jogadoresFormulario.value.push(novoJogador(proximaChave++));
      erroSalvar.value = "";
    };

    const removerJogador = (chave) => {
      if (jogadoresFormulario.value.length > 1) {
        jogadoresFormulario.value = jogadoresFormulario.value.filter(
          (jogador) => jogador.chave !== chave,
        );
      }
    };

    const carregarJogador = async () => {
      if (!idEdicao) return;
      try {
        const resposta = await api.get(`/jogadores/${idEdicao}`);
        jogadoresFormulario.value = [
          { ...resposta.data, chave: proximaChave++ },
        ];
      } catch (erro) {
        erroCarregar.value = mensagemErroApi(
          erro,
          "Não foi possível carregar o jogador para edição.",
        );
      } finally {
        carregando.value = false;
      }
    };

    const salvarJogadores = async () => {
      if (salvando.value || carregando.value || erroCarregar.value) return;
      salvando.value = true;
      erroSalvar.value = "";
      let salvos = 0;

      try {
        for (const jogador of jogadoresFormulario.value) {
          if (!jogador.nome.trim() || !jogador.posicao.trim()) {
            throw {
              response: {
                status: 400,
                data: {
                  message: "Nome e posição não podem conter apenas espaços.",
                },
              },
            };
          }
          const { chave, ...dados } = jogador;
          const payload = {
            ...dados,
            nome: dados.nome.trim(),
            posicao: dados.posicao.trim(),
            clube: dados.clube?.trim() || "",
            numeroCamisa: dados.numeroCamisa === "" ? null : dados.numeroCamisa,
          };
          if (idEdicao) {
            await api.put(`/jogadores/${idEdicao}`, payload);
          } else {
            await api.post("/jogadores", payload);
          }
          salvos++;
        }
        router.push("/");
      } catch (erro) {
        if (!idEdicao && salvos > 0) {
          jogadoresFormulario.value = jogadoresFormulario.value.slice(salvos);
        }
        const mensagem = mensagemErroApi(
          erro,
          "Não foi possível salvar. Tente novamente.",
        );
        erroSalvar.value = salvos
          ? `${salvos} jogador(es) salvo(s). ${mensagem} Corrija o restante e tente novamente.`
          : mensagem;
        console.error(erro);
      } finally {
        salvando.value = false;
      }
    };

    onMounted(carregarJogador);

    return {
      idEdicao,
      jogadoresFormulario,
      salvando,
      erroSalvar,
      carregando,
      erroCarregar,
      adicionarJogador,
      removerJogador,
      salvarJogadores,
    };
  },
};
