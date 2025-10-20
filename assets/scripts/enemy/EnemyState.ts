import { _decorator, Component } from "cc";
import { EntityState } from "../utils/EntityState";
const { ccclass, property } = _decorator;

@ccclass("EnemyState")
export class EnemyState extends EntityState {}
