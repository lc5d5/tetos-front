import { App, Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import {
  useBuscarLocatarios,
  useCriarLocatarios,
  useDeletarLocatarios,
  useEditarLocatarios,
} from "../hooks/locatariosHooks";
import { useState } from "react";

const Locatarios = () => {
  const [mostrarCriar, setMostrarCriar] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const { notification } = App.useApp();
  const { data: niveis, isLoading: loadingLocatarios } = useBuscarLocatarios();
  const { mutate: criarNivel, isLoading: loadingCriar } = useCriarLocatarios();
  const { mutate: editarNivel, isLoading: loadingEditar } =
    useEditarLocatarios();
  const { mutate: deletarNivel } = useDeletarLocatarios();
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

  const formatPhone = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatCpfCnpj = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "").slice(0, 14);

    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Locatários</h2>
        <Button
          type="primary"
          icon={<LuPlus />}
          onClick={() => setMostrarCriar(true)}
        >
          Novo locatário
        </Button>
      </div>

      <div>
        <Table
          dataSource={niveis || []}
          loading={loadingLocatarios}
          rowKey={"id"}
        >
          <Table.Column title="Nome" dataIndex="nome" />
          <Table.Column title="Telefone" dataIndex="telefone" />
          <Table.Column title="CPF/CNPJ" dataIndex="cpf_cnpj" />
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
        title="Criar locatário"
        open={mostrarCriar}
        onClose={() => setMostrarCriar(false)}
      >
        <Form layout="vertical" onFinish={criar}>
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="nome do locatário" />
          </Form.Item>

          <Form.Item
            label="Telefone"
            name="telefone"
            normalize={formatPhone}
            rules={[
              { required: true, message: "Campo obrigatório" },
              {
                pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
                message: "Telefone inválido (use DDD + 8 ou 9 dígitos)",
              },
            ]}
          >
            <Input placeholder="(DDD) 99999-9999" />
          </Form.Item>

          <Form.Item
            label="CPF/CNPJ"
            name="cpf_cnpj"
            normalize={formatCpfCnpj}
            rules={[
              { required: true, message: "Campo obrigatório" },
              {
                validator: (_, value) => {
                  const digits = (value || "").replace(/\D/g, "");
                  if (!digits || digits.length === 11 || digits.length === 14) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Digite um CPF (11) ou CNPJ (14) válido"),
                  );
                },
              },
            ]}
          >
            <Input placeholder="XXX.XXX.XXX-XX" />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loadingCriar}>
              Enviar
            </Button>
          </div>
        </Form>
      </Drawer>

      <Drawer
        title="Editar locatário"
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
            <Input placeholder="nome do locatário" />
          </Form.Item>

          <Form.Item
            label="Telefone"
            name="telefone"
            normalize={formatPhone}
            rules={[
              { required: true, message: "Campo obrigatório" },
              {
                pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
                message: "Telefone inválido (use DDD + 8 ou 9 dígitos)",
              },
            ]}
          >
            <Input placeholder="(DDD) 99999-9999" />
          </Form.Item>

          <Form.Item
            label="CPF/CNPJ"
            name="cpf_cnpj"
            normalize={formatCpfCnpj}
            rules={[
              { required: true, message: "Campo obrigatório" },
              {
                validator: (_, value) => {
                  const digits = (value || "").replace(/\D/g, "");
                  if (!digits || digits.length === 11 || digits.length === 14) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Digite um CPF (11) ou CNPJ (14) válido"),
                  );
                },
              },
            ]}
          >
            <Input placeholder="XXX.XXX.XXX-XX" />
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

export default Locatarios;
