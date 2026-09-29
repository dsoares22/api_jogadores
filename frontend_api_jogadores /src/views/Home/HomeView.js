import { ref, computed, onMounted, watch } from "vue";
import api from "../../services/api";
import { mensagemErroApi } from "../../services/erros";

export default {
  name: "HomeView",
  setup() {
    const jogadores = ref([]);
    const mensagemErro = ref("");
    const filtroStatus = ref("todos");
    const clubeSelecionado = ref("");
    const ativosApi = ref([]);
    const carregandoAtivos = ref(false);
    const erroAtivos = ref("");
    const jogadorDetalhe = ref(null);
    const desempenho = ref(null);
    const carregandoDetalhe = ref(false);
    const erroDetalhe = ref("");
    const detalheAberto = ref(false);
    let consultaDetalhe = 0;
    let consultaAtivos = 0;
    const clubes = computed(() => {
      const nomes = new Map();
      jogadores.value.forEach((jogador) => {
        const nome = jogador.clube?.trim();
        if (nome) nomes.set(nome.toLocaleLowerCase(), nome);
      });
      return [...nomes.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], "pt-BR"))
        .map(([valor, nome]) => ({ valor, nome }));
    });
    const jogadoresAtivos = computed(() =>
      jogadores.value.filter((jogador) => jogador.ativo),
    );
    const jogadoresInativos = computed(() =>
      jogadores.value.filter((jogador) => !jogador.ativo),
    );
    const jogadoresFiltrados = computed(() => {
      if (filtroStatus.value === "ativos") return ativosApi.value;
      if (filtroStatus.value === "inativos") return jogadoresInativos.value;
      if (filtroStatus.value === "clubes") {
        return jogadores.value.filter(
          (jogador) =>
            jogador.clube?.trim().toLocaleLowerCase() ===
            clubeSelecionado.value,
        );
      }
      return jogadores.value;
    });
    const totalClubes = computed(() => clubes.value.length);

    watch(filtroStatus, async (status) => {
      const consulta = ++consultaAtivos;
      erroAtivos.value = "";
      carregandoAtivos.value = false;
      if (status !== "ativos") return;
      carregandoAtivos.value = true;
      try {
        const resposta = await api.get("/jogadores/ativos");
        if (consulta === consultaAtivos) ativosApi.value = resposta.data;
      } catch (erro) {
        if (consulta === consultaAtivos)
          erroAtivos.value = mensagemErroApi(
            erro,
            "Não foi possível consultar os jogadores ativos.",
          );
      } finally {
        if (consulta === consultaAtivos) carregandoAtivos.value = false;
      }
    });

    const fecharDetalhe = () => {
      consultaDetalhe++;
      detalheAberto.value = false;
    };

    const consultarDesempenho = async (id) => {
      const consulta = ++consultaDetalhe;
      detalheAberto.value = true;
      carregandoDetalhe.value = true;
      erroDetalhe.value = "";
      jogadorDetalhe.value = null;
      desempenho.value = null;
      try {
        const [dados, analise] = await Promise.all([
          api.get(`/jogadores/${id}`),
          api.get(`/jogadores/${id}/desempenho`),
        ]);
        if (consulta !== consultaDetalhe) return;
        jogadorDetalhe.value = dados.data;
        desempenho.value = analise.data;
      } catch (erro) {
        if (consulta === consultaDetalhe)
          erroDetalhe.value = mensagemErroApi(
            erro,
            "Não foi possível consultar o desempenho.",
          );
      } finally {
        if (consulta === consultaDetalhe) carregandoDetalhe.value = false;
      }
    };
    const formatarMedia = (media) =>
      Number(media).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const carregarJogadores = async () => {
      mensagemErro.value = "";
      try {
        const resposta = await api.get("/jogadores");
        jogadores.value = resposta.data;
      } catch (erro) {
        mensagemErro.value = mensagemErroApi(
          erro,
          "Não foi possível carregar os jogadores.",
        );
        console.error(erro);
      }
    };

    const apagarJogador = async (id) => {
      if (confirm("Tem certeza que deseja apagar este jogador?")) {
        try {
          await api.delete(`/jogadores/${id}`);
          ativosApi.value = ativosApi.value.filter(
            (jogador) => jogador.id !== id,
          );
          if (jogadorDetalhe.value?.id === id) fecharDetalhe();
          await carregarJogadores();
        } catch (erro) {
          alert(mensagemErroApi(erro, "Não foi possível apagar o jogador."));
        }
      }
    };

    onMounted(() => {
      carregarJogadores();
    });

    return {
      jogadores,
      filtroStatus,
      clubeSelecionado,
      clubes,
      jogadoresAtivos,
      jogadoresInativos,
      jogadoresFiltrados,
      totalClubes,
      mensagemErro,
      apagarJogador,
      carregandoAtivos,
      erroAtivos,
      jogadorDetalhe,
      desempenho,
      carregandoDetalhe,
      erroDetalhe,
      detalheAberto,
      consultarDesempenho,
      fecharDetalhe,
      formatarMedia,
    };
  },
};
