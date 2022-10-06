import {Entity} from '../engine/entity.js';
import {Pool} from '../utils/pool.js';
import {removeItem} from '../utils/array.js';
import {isColliding} from '../utils/math.js';
import {Vec2} from '../utils/vec2.js';

export class Collision2dRegistry extends Entity {
  init() {
    this.colliders = [];
    this.nextId = 0;
    this.collisionTree = null;
    this.maxBranching = 10;
    this.collisionNodePool = new Pool(() => ({
      x: null,
      y: null,
      width: null,
      height: null,
      maxId: null,
      collider: null,
      children: [],
    }));
  }

  async body() {
    while (true) {
      await this.tick();

      this.buildCollisionTree();

      for (const collider of this.colliders) {
        if (collider.transform && collider.solid) {
          this.collide(collider, this.collisionTree);
        }
      }
    }
  }

  async buildCollisionTree() {
    this.collisionNodePool.releaseAll();
    this.collisionTree = null;
    for (const collider of this.colliders) {
      collider.colliding = false;
      if (!collider.solid) {
        continue;
      }
      const colliderNode = this.collisionNodePool.acquire();
      if (!collider.rectFunc(colliderNode)) {
        continue;
      }
      colliderNode.collider = collider;
      colliderNode.children.length = 0;
      colliderNode.maxId = collider.id;
      this.collisionTree = this.insert(colliderNode, this.collisionTree);
    }
  }

  insert(colliderNode, collisionSubTree) {
    if (collisionSubTree === null) {
      return colliderNode;
    }

    if (collisionSubTree.collider) {
      const otherColliderNode = collisionSubTree;
      const branchNode = this.collisionNodePool.acquire();
      branchNode.collider = null;
      branchNode.x = Math.min(colliderNode.x, otherColliderNode.x);
      branchNode.y = Math.min(colliderNode.y, otherColliderNode.y);
      branchNode.width = Math.max(colliderNode.x + colliderNode.width, otherColliderNode.x + otherColliderNode.width) - branchNode.x;
      branchNode.height = Math.max(colliderNode.y + colliderNode.height, otherColliderNode.y + otherColliderNode.height) - branchNode.y;
      branchNode.maxId = Math.max(colliderNode.maxId, otherColliderNode.maxId);
      branchNode.children.length = 0;
      branchNode.children.push(colliderNode);
      branchNode.children.push(otherColliderNode);
      return branchNode;
    }

    const branchNode = collisionSubTree;
    branchNode.width = Math.max(branchNode.width, branchNode.x + branchNode.width - colliderNode.x, colliderNode.x + colliderNode.width - branchNode.x);
    branchNode.height = Math.max(branchNode.height, branchNode.y + branchNode.height - colliderNode.y, colliderNode.y + colliderNode.height - branchNode.y);
    branchNode.x = Math.min(branchNode.x, colliderNode.x);
    branchNode.y = Math.min(branchNode.y, colliderNode.y);
    branchNode.maxId = Math.min(branchNode.maxId, colliderNode.maxId);
    if (branchNode.children.length < this.maxBranching) {
      branchNode.children.push(colliderNode);
    } else {
      let mergeIndex = null;
      let leastAreaAdd = Infinity;
      for (let i = 0; i < branchNode.children.length; ++i) {
        const childNode = branchNode.children[i];
        const newArea = (
          Math.max(childNode.width, childNode.x + childNode.width - colliderNode.x, colliderNode.x + colliderNode.width - childNode.x)
          *
          Math.max(childNode.height, childNode.y + childNode.height - colliderNode.y, colliderNode.y + colliderNode.height - childNode.y)
        );
        const areaAdd = newArea - (childNode.width * childNode.height);
        if (areaAdd < leastAreaAdd) {
          mergeIndex = i;
          leastAreaAdd = areaAdd;
        }
      }

      branchNode.children[mergeIndex] = this.insert(colliderNode, branchNode.children[mergeIndex]);
    }
    return branchNode;
  }

  collide(collider, collisionNode) {
    if (!isColliding(
        collider.transform.translate.x, collider.transform.translate.y, collider.width, collider.height,
        collisionNode.x, collisionNode.y, collisionNode.width, collisionNode.height)) {
      return;
    }
    if (collisionNode.collider) {
      const otherCollider = collisionNode.collider;
      if (collider.id >= otherCollider.id) {
        return;
      }
      maybeInvokeCollisionFunc(collider, otherCollider);
      maybeInvokeCollisionFunc(otherCollider, collider);
    } else {
      for (const child of collisionNode.children) {
        this.collide(collider, child);
      }
    }
  }

  register(job, rectFunc, collisionFunc) {
    const collider = {
      id: this.nextId++,
      job,
      filterTypes: null,
      solid: true,
      rectFunc,
      collisionFunc,
      colliding: false,
    };
    job.registerCleanUp(() => {
      removeItem(this.colliders, collider);
    });
    this.colliders.push(collider);
    return collider;
  }

  onDebugDraw(context, width, height) {
    context.resetTransform();
    this.debugDrawNode(context, this.collisionTree);
  }

  debugDrawNode(context, collisionNode) {
    if (!collisionNode) {
      return;
    }
    if (collisionNode.collider) {
      const collider = collisionNode.collider;
      if (collider.colliding) {
        context.strokeStyle = '#f00';
      } else {
        context.strokeStyle = '#800';
      }
      context.strokeRect(collisionNode.x, collisionNode.y, collisionNode.width, collisionNode.height);
    } else {
      context.strokeStyle = '#0004';
      context.strokeRect(collisionNode.x, collisionNode.y, collisionNode.width, collisionNode.height);
      for (const child of collisionNode.children) {
        this.debugDrawNode(context, child);
      }
    }
  }
}

function maybeInvokeCollisionFunc(collider, otherCollider) {
  if (collider.filterTypes) {
    let found = false;
    for (const type of collider.filterTypes) {
      if (otherCollider.job instanceof type) {
        found = true;
        break;
      }
    }
    if (!found) {
      return;
    }
  }
  collider.colliding = true;
  collider.collisionFunc(otherCollider.job, otherCollider);
}