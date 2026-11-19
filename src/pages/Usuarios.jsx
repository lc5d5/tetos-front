import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import {
  useBuscarUsuarios,
  useCriarUsuarios,
  useDeletarUsuarios,
  useEditarUsuarios,
} from "../hooks/usuariosHooks";
import { useState } from "react";
import { useBuscarNiveis } from "../hooks/niveisHooks";

const Usuarios = () => {
  const [mostrarCriar, setMostrarCriar] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const { notification } = App.useApp();
  const { data: niveis } = useBuscarNiveis();
  const { data: usuarios, isLoading: loadingUsuarios } = useBuscarUsuarios();
  const { mutate: criarNivel, isLoading: loadingCriar } = useCriarUsuarios();
  const { mutate: editarNivel, isLoading: loadingEditar } = useEditarUsuarios();
  const { mutate: deletarNivel } = useDeletarUsuarios();
  const [formCriar] = Form.useForm();
  const [formEditar] = Form.useForm();

  function criar(dados) {
    criarNivel(dados, {
      onSuccess: ({ type, description }) => {
        setMostrarCriar(false);
        formCriar.resetFields();
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
        <h2 className="text-3xl font-bold">Usuários</h2>
        <Button
          type="primary"
          icon={<LuPlus />}
          onClick={() => setMostrarCriar(true)}
        >
          Novo Usuário
        </Button>
      </div>

      <div>
        <Table
          dataSource={usuarios || []}
          loading={loadingUsuarios}
          rowKey={"id"}
        >
          <Table.Column title="Nome" dataIndex="nome" />
          <Table.Column title="Email" dataIndex="email" />
          <Table.Column title="Nível" dataIndex={["niveis", "nome"]} />
          <Table.Column
            title="Ações"
            className="w-25"
            render={(_, linha) => (
              <div className="flex gap-2">
                <Button
                  icon={<LuPencil />}
                  type="primary"
                  onClick={() => {
                    formEditar.setFieldsValue(linha);
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
        title="Criar Usuário"
        open={mostrarCriar}
        onClose={() => setMostrarCriar(false)}
      >
        <Form layout="vertical" onFinish={criar}>
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="nome do usuário" />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="seuemail@email.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="********" />
          </Form.Item>

          <Form.Item
            label="Nível"
            name="niveis_id"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Select
              placeholder="Escolha um nível"
              options={(niveis || []).map((nivel) => {
                return {
                  label: nivel.nome,
                  value: nivel.id,
                };
              })}
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loadingCriar}>
              Enviar
            </Button>
          </div>
        </Form>
      </Drawer>

      <Drawer
        title="Editar Usuário"
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
            <Input placeholder="nome do usuário" />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="seuemail@email.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
          >
            <Input placeholder="********" />
          </Form.Item>

          <Form.Item
            label="Nível"
            name="niveis_id"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Select
              placeholder="Escolha um nível"
              options={(niveis || []).map((nivel) => {
                return {
                  label: nivel.nome,
                  value: nivel.id,
                };
              })}
            />
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

export default Usuarios;
