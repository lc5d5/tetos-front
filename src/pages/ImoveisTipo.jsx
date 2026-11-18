import { App, Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import {
  useBuscarImoveisTipo,
  useCriarImoveisTipo,
  useDeletarImoveisTipo,
  useEditarImoveisTipo,
} from "../hooks/imoveisTipoHooks";
import { useState } from "react";

const ImoveisTipo = () => {
  const [mostrarCriar, setMostrarCriar] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const { notification } = App.useApp();
  const { data: niveis, isLoading: loadingImoveisTipo } = useBuscarImoveisTipo();
  const { mutate: criarNivel, isLoading: loadingCriar } = useCriarImoveisTipo();
  const { mutate: editarNivel, isLoading: loadingEditar } = useEditarImoveisTipo();
  const { mutate: deletarNivel } = useDeletarImoveisTipo();
  const [formEditar] = Form.useForm();

  function criar(dados) {
    criarNivel(dados, {
      onSuccess: ({ type, description }) => {
        setMostrarCriar(false);
        notification[type]({
          description,
          placement: "bottomRight",
        });
      },
      onError: ({
        response: {
          data: { type, description },
        },
      }) => {
        notification[type]({
          description,
        });
        console.log();
      },
    });
  }

  function editar(dados) {
    console.log(dados);
    editarNivel(dados, {
      onSuccess: ({ type, description }) => {
        setMostrarEditar(false);
        notification[type]({
          description,
          placement: "bottomRight",
        });
      },
      onError: ({
        response: {
          data: { type, description },
        },
      }) => {
        notification[type]({
          description,
        });
      },
    });
  }

  function deletar(id) {
    deletarNivel(id, {
      onSuccess: ({ type, description }) => {
        notification[type]({
          description,
          placement: "bottomRight",
        });
      },
      onError: ({
        response: {
          data: { type, description },
        },
      }) => {
        notification[type]({
          description,
        });
      },
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Tipos de imóvel</h2>
        <Button
          type="primary"
          icon={<LuPlus />}
          onClick={() => setMostrarCriar(true)}
        >
          Novo tipo
        </Button>
      </div>

      <div>
        <Table dataSource={niveis || []} loading={loadingImoveisTipo} rowKey={"id"}>
          <Table.Column title="Nome" dataIndex="nome" />
          <Table.Column
            title="Ações"
            className="w-25"
            render={(_, linha) => (
              <div className="flex gap-2">
                <Button
                  icon={<LuPencil />}
                  type="primary"
                  onClick={() => {
                    formEditar.setFieldValue("id", linha.id);
                    formEditar.setFieldValue("nome", linha.nome);
                    setMostrarEditar(true);
                  }}
                />
                <Popconfirm
                  title="Aviso:"
                  description="Deseja realmente apagar?"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={() => deletar(linha.id)}
                >
                  <Button icon={<LuTrash2 />} type="primary" />
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </div>

      <Drawer
        title="Criar tipo"
        open={mostrarCriar}
        onClose={() => setMostrarCriar(false)}
      >
        <Form layout="vertical" onFinish={criar}>
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="nome do tipo" />
          </Form.Item>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loadingCriar}>
              Enviar
            </Button>
          </div>
        </Form>
      </Drawer>

      <Drawer
        title="Editar tipo"
        open={mostrarEditar}
        onClose={() => setMostrarEditar(false)}
        destroyOnHidden={true}
      >
        <Form form={formEditar} layout="vertical" onFinish={editar}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Novo nome:"
            name="nome"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="nome do tipo" />
          </Form.Item>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loadingEditar}>
              Enviar
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default ImoveisTipo;
