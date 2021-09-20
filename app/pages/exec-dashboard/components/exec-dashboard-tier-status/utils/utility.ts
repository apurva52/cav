import { Dialogs, DrawingTools, Node, Port, Edge, Group, jsPlumbToolkit, Surface } from 'jsplumbtoolkit';

export class ExecDashboardUtil {

    static isNode(obj: Node | Port | Edge | Group): obj is Node {
        return obj.objectType === 'Node';
    }
}
