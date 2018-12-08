import Seneca from "seneca";
import SenecaPromise from "seneca-promise";
const seneca = Seneca();

seneca.use(SenecaPromise);

// data =
// {
//   type: 'domain',
//   name: 'Person'
//   fields: {
//     name: {
//       type: 'string'
//     }
//   }
// }

interface ASTNode {
  type: string;
  name: string;
}

export const createServer = () => new ASTServer();

// triggered by AST domain node encountered
export class ASTServer {
  async onNode(node: ASTNode) {
    try {
      const result = await seneca.actAsync({
        role: "aml",
        cmd: node.type,
        data: node
      });
      this.handleResult(result);
    } catch (err) {
      this.handleError(err);
    }
  }

  handleResult(result) {
    console.log({ result });
  }

  handleError(err) {
    console.error({ err });
    throw err;
  }
}

// const server = createServer();
// server.onNode({ type: "domain", name: "User" });
