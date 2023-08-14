"use strict";


class ValueError extends Error{
    constructor(msg) {
        super(msg);
        this.name = "ValueError";
    }
}