import React from "react";

import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Goback from "../../components/Proposal/goback";
import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";

export default function ProposalCreate() {
  return (
    <Layout tabIndex={0}>
      <div className="container">
        <Goback />
        <div className="divide-line" />

        <div className="creat_propoal">
          <Form className="creat_propoal__form">
            <h2>Create a Proposal</h2>
            <FormGroup>
              <Label for="proposal_name">Proposal Name</Label>
              <Input
                type="text"
                name="name"
                id="proposal_name"
                placeholder=""
              />
            </FormGroup>
            <FormGroup>
              <Label for="proposal_description">Proposal Description</Label>
              <Input
                type="textarea"
                name="desc"
                id="proposal_description"
                style={{ height: 166 }}
              />
            </FormGroup>
            <div className="creat_propoal__btns">
              <Button className="p_btn">Cancel</Button>
              <Button className="p_btn--primary">Create Proposal</Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
